export const dynamic = "force-dynamic";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json("Unauhthenticated!!", { status: 401 });
    }

    const products = await db.product.findMany({
      orderBy: {
        name: "asc",
      },
    });
    if (!products) {
      return NextResponse.json("No products found", { status: 404 });
    }
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json("error fetching prodcuts", { status: 400 });
  }
}
