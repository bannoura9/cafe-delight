"use client";

import { useEffect, useState } from "react";

type Snapshot = {
  status:
    | "pending_payment"
    | "received"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  readyAt: number | null;
  notifiedAt: number | null;
};

const STATUS_LABEL: Record<Snapshot["status"], string> = {
  pending_payment: "Waiting for payment…",
  received: "Order received",
  preparing: "Preparing your order",
  ready: "Ready for pickup! 🎉",
  completed: "Picked up — thanks!",
  cancelled: "Cancelled",
};

export function OrderStatusPoll({
  orderId,
  initial,
}: {
  orderId: string;
  initial: Snapshot;
}) {
  const [snap, setSnap] = useState<Snapshot>(initial);

  useEffect(() => {
    if (snap.status === "ready" || snap.status === "completed") return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
        if (res.ok) setSnap(await res.json());
      } catch {
        /* ignore */
      }
    }, 2500);
    return () => clearInterval(t);
  }, [orderId, snap.status]);

  const isReady = snap.status === "ready" || snap.status === "completed";

  return (
    <div
      className={`mt-5 rounded-xl px-4 py-3 border ${
        isReady
          ? "bg-leaf/10 border-leaf/30 text-leaf"
          : "bg-cream border-espresso/10 text-espresso/80"
      }`}
    >
      <div className="font-medium">{STATUS_LABEL[snap.status]}</div>
      {snap.notifiedAt ? (
        <div className="text-sm mt-0.5">SMS sent.</div>
      ) : null}
    </div>
  );
}
