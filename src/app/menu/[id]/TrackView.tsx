"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/track";

export function TrackView({
  id,
  name,
  category,
  priceCents,
}: {
  id: string;
  name: string;
  category: string;
  priceCents: number;
}) {
  useEffect(() => {
    trackViewItem({ id, name, category, priceCents });
  }, [id, name, category, priceCents]);
  return null;
}
