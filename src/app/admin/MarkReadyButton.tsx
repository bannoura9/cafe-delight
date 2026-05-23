"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markReady } from "./actions";

export function MarkReadyButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col items-end">
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setErr(null);
            const res = await markReady(id);
            if (!res.ok) setErr(res.error ?? "Failed");
            else router.refresh();
          })
        }
        className="rounded-full bg-leaf text-white px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Mark ready & text customer"}
      </button>
      {err ? <div className="text-xs text-red-600 mt-1">{err}</div> : null}
    </div>
  );
}
