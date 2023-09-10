import { NextResponse } from "next/server";
import Product from "@/models/prodcut";
import { connectToDB } from "@/utils/database";

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find({});

    return NextResponse.json({
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products from the database:", error);
    return NextResponse.error;
  }
}
