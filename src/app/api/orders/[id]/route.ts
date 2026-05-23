import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json({
    status: order.status,
    readyAt: order.readyAt,
    notifiedAt: order.notifiedAt,
  });
}
