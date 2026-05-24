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
  paidAt,
  pickupEtaMinutes,
}: {
  orderId: string;
  initial: Snapshot;
  paidAt: number | null;
  pickupEtaMinutes: number;
}) {
  const [snap, setSnap] = useState<Snapshot>(initial);
  const [now, setNow] = useState(Date.now());

  // Poll the API for status changes.
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

  // Tick clock once a second for the ETA countdown.
  useEffect(() => {
    if (!paidAt) return;
    if (snap.status === "ready" || snap.status === "completed") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [paidAt, snap.status]);

  const isReady = snap.status === "ready" || snap.status === "completed";
  const isPaid = !!paidAt;

  // ETA countdown — only when paid and not yet ready.
  let countdownLabel: string | null = null;
  if (isPaid && !isReady) {
    const target = paidAt! + pickupEtaMinutes * 60 * 1000;
    const remainingMs = Math.max(0, target - now);
    const m = Math.floor(remainingMs / 60000);
    const s = Math.floor((remainingMs % 60000) / 1000);
    countdownLabel =
      remainingMs === 0
        ? "Should be ready any moment now"
        : `Ready in ${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div
      className={`mt-5 rounded-xl px-4 py-3 border ${
        isReady
          ? "bg-leaf/10 border-leaf/30 text-leaf"
          : "bg-cream border-espresso/10 text-espresso/80"
      }`}
    >
      <div className="font-medium">{STATUS_LABEL[snap.status]}</div>
      {countdownLabel ? (
        <div className="text-sm mt-1 tabular-nums">⏱️ {countdownLabel}</div>
      ) : null}
      {snap.notifiedAt ? (
        <div className="text-sm mt-0.5">Email sent.</div>
      ) : null}
    </div>
  );
}
