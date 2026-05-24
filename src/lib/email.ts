import { Resend } from "resend";
import { config } from "./config";
import type { Order } from "./orders";
import { formatMoney } from "./menu";

const resend = config.resend.apiKey ? new Resend(config.resend.apiKey) : null;

export type EmailResult = { ok: true } | { ok: false; error: string };

/**
 * Send the "your order is ready for pickup" email to the customer.
 * Called from the staff /admin Mark Ready button.
 * In mock mode (no Resend key), just logs and returns ok.
 */
export async function sendOrderReadyEmail(order: Order): Promise<EmailResult> {
  if (!order.customerEmail) {
    return { ok: false, error: "No customer email on order" };
  }
  if (!resend || !config.resend.fromEmail) {
    console.log(`[mock-email] ready -> ${order.customerEmail}: order #${order.id}`);
    return { ok: true };
  }

  const html = readyEmailHtml(order);

  try {
    const res = await resend.emails.send({
      from: `${config.businessName} <${config.resend.fromEmail}>`,
      to: order.customerEmail,
      subject: `Your order is ready — pick up at ${config.businessName} 🎉`,
      html,
    });
    if (res.error) {
      return { ok: false, error: res.error.message };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}

function readyEmailHtml(order: Order): string {
  const itemRows = order.items
    .map((it) => {
      const mods =
        it.modifiers.length > 0
          ? `<div style="font-size:12px;color:#6b3a1c;margin-top:2px">${it.modifiers.map((m) => escapeHtml(m.name)).join(" · ")}</div>`
          : "";
      return `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f3e9d4">
            <div style="font-weight:500">${it.quantity}× ${escapeHtml(it.name)}</div>
            ${mods}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #f3e9d4;text-align:right;font-variant-numeric:tabular-nums">
            ${formatMoney(it.lineTotalCents)}
          </td>
        </tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#fbf7ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#4a2912;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #f3e9d4">
    <div style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#5a7a4f;margin-bottom:4px">
      Order #${order.id} · Ready for pickup
    </div>
    <h1 style="font-size:26px;margin:0 0 12px 0;font-family:Georgia,serif">
      ${escapeHtml(order.customerName.split(" ")[0])}, your order is ready! ☕
    </h1>
    <p style="margin:0 0 24px 0;color:#6b3a1c;line-height:1.5">
      Come grab it at ${escapeHtml(config.businessAddress)}. Just show this
      email or your order number at the counter.
    </p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      ${itemRows}
    </table>

    <p style="margin:24px 0 0 0;font-size:13px;color:#6b3a1c">
      Total paid: <strong>${formatMoney(order.totalCents)}</strong> ·{" "}
      <a href="https://cafedelightco.com/order/${order.id}" style="color:#e88a16">View order online</a>
    </p>
  </div>
  <div style="text-align:center;margin-top:16px;font-size:12px;color:#6b3a1c">
    ${escapeHtml(config.businessName)} · ${escapeHtml(config.businessAddress)}
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
