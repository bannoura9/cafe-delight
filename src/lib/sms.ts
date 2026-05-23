import { config } from "./config";
import { sql } from "./db";

export type SmsLog = {
  to: string;
  body: string;
  sentAt: number;
  status: "mock-sent" | "sent" | "failed";
  error?: string;
};

type SmsRow = {
  to_number: string;
  body: string;
  sent_at: number;
  status: SmsLog["status"];
  error: string | null;
};

async function logSms(entry: SmsLog): Promise<void> {
  await sql`
    INSERT INTO sms_log (to_number, body, sent_at, status, error)
    VALUES (${entry.to}, ${entry.body}, ${entry.sentAt}, ${entry.status}, ${entry.error ?? null})
  `;
}

export async function getSmsLog(limit = 20): Promise<SmsLog[]> {
  const rows = (await sql`
    SELECT * FROM sms_log ORDER BY sent_at DESC LIMIT ${limit}
  `) as SmsRow[];
  return rows.map((r) => ({
    to: r.to_number,
    body: r.body,
    sentAt: Number(r.sent_at),
    status: r.status,
    error: r.error ?? undefined,
  }));
}

export async function sendSms(to: string, body: string): Promise<SmsLog> {
  if (config.mockMode) {
    const entry: SmsLog = { to, body, sentAt: Date.now(), status: "mock-sent" };
    await logSms(entry);
    console.log(`[mock-sms] -> ${to}: ${body}`);
    return entry;
  }

  const { accountSid, authToken, fromNumber } = config.twilio;
  if (!accountSid || !authToken || !fromNumber) {
    const entry: SmsLog = {
      to,
      body,
      sentAt: Date.now(),
      status: "failed",
      error: "Twilio credentials not set",
    };
    await logSms(entry);
    return entry;
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: fromNumber, Body: body });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    const entry: SmsLog = {
      to,
      body,
      sentAt: Date.now(),
      status: "failed",
      error: text,
    };
    await logSms(entry);
    return entry;
  }

  const entry: SmsLog = { to, body, sentAt: Date.now(), status: "sent" };
  await logSms(entry);
  return entry;
}
