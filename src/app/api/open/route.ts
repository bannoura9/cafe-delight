import { NextResponse } from "next/server";
import { isOpenNow, hoursLabel } from "@/lib/hours";

export async function GET() {
  return NextResponse.json(
    { open: isOpenNow(), hours: hoursLabel() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
