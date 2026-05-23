import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { formatMoney } from "@/lib/menu";
import { config } from "@/lib/config";
import { OrderStatusPoll } from "./OrderStatusPoll";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <ClearCartOnMount />
      <div className="rounded-2xl bg-cream-2/50 border border-espresso/10 p-6">
        <div className="text-sm uppercase tracking-wider text-crema-2">
          Order #{order.id}
        </div>
        <h1 className="display text-3xl text-espresso mt-1">
          Thanks, {order.customerName.split(" ")[0]}!
        </h1>
        <p className="text-espresso/70 mt-2">
          We&apos;re making your order at {config.businessAddress}. We&apos;ll text{" "}
          {maskPhone(order.customerPhone)} when it&apos;s ready (~
          {config.pickupEtaMinutes} min).
        </p>

        <OrderStatusPoll orderId={order.id} initial={{
          status: order.status,
          readyAt: order.readyAt,
          notifiedAt: order.notifiedAt,
        }} />
      </div>

      <div className="mt-6 rounded-2xl border border-espresso/10 p-6">
        <h2 className="display text-xl text-espresso mb-3">Your order</h2>
        <ul className="divide-y divide-espresso/10">
          {order.items.map((item, i) => (
            <li key={i} className="py-2 flex justify-between gap-3">
              <div>
                <div className="font-medium">
                  {item.quantity}× {item.name}
                </div>
                {item.modifiers.length > 0 ? (
                  <div className="text-sm text-espresso/60">
                    {item.modifiers.map((m) => m.name).join(" · ")}
                  </div>
                ) : null}
              </div>
              <div className="tabular-nums">{formatMoney(item.lineTotalCents)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 tabular-nums text-sm">
          <Row label="Subtotal" value={formatMoney(order.subtotalCents)} />
          <Row label="Tax" value={formatMoney(order.taxCents)} />
          <Row label="Tip" value={formatMoney(order.tipCents)} />
          <Row label="Total" value={formatMoney(order.totalCents)} bold />
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/menu" className="text-sm underline underline-offset-4">
          Order something else
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold text-base text-espresso pt-2 border-t border-espresso/10" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function maskPhone(p: string): string {
  const digits = p.replace(/\D/g, "");
  if (digits.length < 4) return p;
  return `••• ••• ${digits.slice(-4)}`;
}
