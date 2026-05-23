import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { listOrders } from "@/lib/orders";
import { getSmsLog } from "@/lib/sms";
import { formatMoney } from "@/lib/menu";
import { MarkReadyButton } from "./MarkReadyButton";

export default async function AdminPage() {
  const user = await currentUser();
  const [orders, sms] = await Promise.all([listOrders(), getSmsLog(8)]);

  const displayName =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses[0]?.emailAddress ??
    "Staff";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="display text-3xl text-espresso">Staff dashboard</h1>
          <div className="text-sm text-espresso/60">Signed in as {displayName}</div>
        </div>
        <UserButton />
      </div>

      <section className="mb-10">
        <h2 className="font-semibold text-espresso mb-3">Active orders</h2>
        {orders.length === 0 ? (
          <div className="text-espresso/60 text-sm">No orders yet.</div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-espresso/10 bg-cream-2/40 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{o.id}</span>
                    <StatusPill status={o.status} />
                    <span className="text-sm text-espresso/60">
                      {new Date(o.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm mt-1">
                    {o.customerName} · {o.customerPhone}
                  </div>
                  <ul className="text-sm text-espresso/70 mt-1">
                    {o.items.map((it, i) => (
                      <li key={i}>
                        {it.quantity}× {it.name}
                        {it.modifiers.length > 0
                          ? ` (${it.modifiers.map((m) => m.name).join(", ")})`
                          : ""}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="tabular-nums font-medium">
                    {formatMoney(o.totalCents)}
                  </div>
                  {o.status !== "ready" && o.status !== "completed" && o.status !== "cancelled" ? (
                    <MarkReadyButton id={o.id} />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold text-espresso mb-3">Recent SMS</h2>
        {sms.length === 0 ? (
          <div className="text-espresso/60 text-sm">No messages yet.</div>
        ) : (
          <ul className="space-y-2 text-sm">
            {sms.map((s, i) => (
              <li
                key={i}
                className="rounded-xl border border-espresso/10 bg-cream px-3 py-2"
              >
                <div className="text-espresso/60">
                  {new Date(s.sentAt).toLocaleTimeString()} → {s.to} ·{" "}
                  <span className="font-medium">{s.status}</span>
                </div>
                <div>{s.body}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "ready"
      ? "bg-leaf/15 text-leaf"
      : status === "completed"
        ? "bg-espresso/10 text-espresso/70"
        : status === "pending_payment"
          ? "bg-amber-100 text-amber-800"
          : status === "cancelled"
            ? "bg-red-100 text-red-700"
            : "bg-crema/20 text-crema-2";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles}`}>
      {status}
    </span>
  );
}
