import { Resend } from "resend";
import { config } from "./config";
import type { Order } from "./orders";
import { formatMoney } from "./menu";

const resend = config.resend.apiKey ? new Resend(config.resend.apiKey) : null;

export async function sendOrderReceipt(order: Order): Promise<{ ok: boolean; error?: string }> {
  if (!order.customerEmail) {
    return { ok: false, error: "No customer email on order" };
  }
  if (!resend || !config.resend.fromEmail) {
    return { ok: false, error: "Resend not configured" };
  }

  const itemRows = order.items
    .map((it) => {
      const mods =
        it.modifiers.length > 0
          ? `<div style="font-size:12px;color:#6b3a1c;margin-top:2px">${it.modifiers.map((m) => m.name).join(" · ")}</div>`
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

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#fbf7ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#4a2912;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #f3e9d4">
    <div style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#e88a16;margin-bottom:4px">
      Order #${order.id}
    </div>
    <h1 style="font-size:24px;margin:0 0 16px 0;font-family:Georgia,serif">
      Thanks, ${escapeHtml(order.customerName.split(" ")[0])}!
    </h1>
    <p style="margin:0 0 24px 0;color:#6b3a1c;line-height:1.5">
      We received your order at ${escapeHtml(config.businessAddress)}. We&rsquo;ll
      text ${escapeHtml(maskPhone(order.customerPhone))} when it&rsquo;s ready
      (~${config.pickupEtaMinutes} min).
    </p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      ${itemRows}
    </table>

    <table style="width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums">
      <tr><td style="padding:4px 0;color:#6b3a1c">Subtotal</td><td style="text-align:right;padding:4px 0">${formatMoney(order.subtotalCents)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b3a1c">Tax</td><td style="text-align:right;padding:4px 0">${formatMoney(order.taxCents)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b3a1c">Tip</td><td style="text-align:right;padding:4px 0">${formatMoney(order.tipCents)}</td></tr>
      <tr><td style="padding:8px 0 0 0;font-weight:600;border-top:1px solid #f3e9d4">Total</td><td style="text-align:right;padding:8px 0 0 0;font-weight:600;border-top:1px solid #f3e9d4">${formatMoney(order.totalCents)}</td></tr>
    </table>

    <p style="margin:24px 0 0 0;font-size:13px;color:#6b3a1c">
      Track your order: <a href="https://cafedelightco.com/order/${order.id}" style="color:#e88a16">cafedelightco.com/order/${order.id}</a>
    </p>
  </div>
  <div style="text-align:center;margin-top:16px;font-size:12px;color:#6b3a1c">
    ${escapeHtml(config.businessName)} · ${escapeHtml(config.businessAddress)}
  </div>
</body>
</html>`;

  try {
    const res = await resend.emails.send({
      from: `${config.businessName} <${config.resend.fromEmail}>`,
      to: order.customerEmail,
      subject: `Order received — #${order.id} · ${formatMoney(order.totalCents)}`,
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function maskPhone(p: string): string {
  const d = p.replace(/\D/g, "");
  return d.length >= 4 ? `••• ••• ${d.slice(-4)}` : p;
}
