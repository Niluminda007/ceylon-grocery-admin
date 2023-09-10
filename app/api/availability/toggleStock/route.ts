import Product from "@/models/prodcut";
import { connectToDB } from "@/utils/database";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { id, inStock } = await req.json();
    if (!id || inStock === undefined) {
      return NextResponse.json({ message: "Invalid request data" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" });
    }
    return NextResponse.json({
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return;
  }
}
