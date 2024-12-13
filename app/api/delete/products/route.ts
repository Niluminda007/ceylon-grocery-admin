import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import cloudinary from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const ids = req.nextUrl.searchParams.get("ids");
    if (!ids) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 400 }
      );
    }

    const productIds = ids.split(",");
    const existingProducts = await db.product.findMany({
      where: { id: { in: productIds } },
    });
    if (existingProducts.length === 0) {
      return NextResponse.json(
        { message: "No valid products found for deletion." },
        { status: 404 }
      );
    }
    const transaction = existingProducts.map((product) =>
      db.product.delete({ where: { id: product.id } })
    );

    await db.$transaction(transaction);
    await Promise.all(
      existingProducts.map((product) => {
        const publicId = product.images[0];
        if (publicId && !publicId.includes("default")) {
          return deleteImageFromCloudinary(publicId);
        }
        return Promise.resolve();
      })
    );

    revalidatePath("/catalog/products");

    return NextResponse.json("Products deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting products:", error);
    return NextResponse.json(
      { message: "Error deleting products.", error },
      { status: 500 }
    );
  }
}
