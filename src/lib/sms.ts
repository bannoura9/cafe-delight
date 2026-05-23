import { config } from "./config";

type SmsLog = {
  to: string;
  body: string;
  sentAt: number;
  status: "mock-sent" | "sent" | "failed";
  error?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __cafeDelightSmsLog: SmsLog[] | undefined;
}

const smsLog: SmsLog[] = globalThis.__cafeDelightSmsLog ?? [];
globalThis.__cafeDelightSmsLog = smsLog;

export function getSmsLog(): SmsLog[] {
  return smsLog.slice().reverse();
}

export async function sendSms(to: string, body: string): Promise<SmsLog> {
  if (config.mockMode) {
    const entry: SmsLog = { to, body, sentAt: Date.now(), status: "mock-sent" };
    smsLog.push(entry);
    console.log(`[mock-sms] -> ${to}: ${body}`);
    return entry;
  }

  // Real Twilio integration. https://www.twilio.com/docs/sms/api
  const { accountSid, authToken, fromNumber } = config.twilio;
  if (!accountSid || !authToken || !fromNumber) {
    const entry: SmsLog = {
      to,
      body,
      sentAt: Date.now(),
      status: "failed",
      error: "Twilio credentials not set",
    };
    smsLog.push(entry);
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
    smsLog.push(entry);
    return entry;
  }

  const entry: SmsLog = { to, body, sentAt: Date.now(), status: "sent" };
  smsLog.push(entry);
  return entry;
}
