import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json("Unauhthenticated!!", { status: 401 });
    }

    const productId = req.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json("product id is required", { status: 500 });
    }

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      return NextResponse.json("No product for given id found", {
        status: 404,
      });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json("error fetching prodcut", { status: 400 });
  }
}
