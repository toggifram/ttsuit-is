import { NextResponse } from "next/server";

import {
  listRecentPickupOrders,
  lookupPickupOrder,
  pickupLookupMessage,
} from "@/lib/pickup-label";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const list = url.searchParams.get("list");
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (list === "1") {
    const result = await listRecentPickupOrders();
    if (!result.ok) {
      return NextResponse.json({
        error: pickupLookupMessage(result.error),
        code: result.error,
        orders: [],
      });
    }
    return NextResponse.json({ orders: result.orders });
  }

  if (!query) {
    return NextResponse.json({ error: "Settu inn pöntunarnúmer." }, { status: 400 });
  }

  const result = await lookupPickupOrder(query);
  if (!result.ok) {
    const status = result.error === "not_found" ? 404 : 200;
    return NextResponse.json(
      { error: pickupLookupMessage(result.error), code: result.error },
      { status }
    );
  }

  return NextResponse.json({ order: result.order });
}
