import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
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
        { message: "Category ID(s) are required." },
        { status: 400 }
      );
    }

    const categoryIds = ids.split(",");

    const existingCategories = await db.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (existingCategories.length === 0) {
      return NextResponse.json(
        { message: "No valid categories found for deletion." },
        { status: 404 }
      );
    }

    const associatedProducts = await db.product.findMany({
      where: { category_id: { in: categoryIds } },
    });

    if (associatedProducts.length > 0) {
      const associatedCategoryIds = Array.from(
        new Set(associatedProducts.map((product) => product.category_id))
      );

      const associatedCategories = await db.category.findMany({
        where: { id: { in: associatedCategoryIds } },
        select: { id: true, name: true },
      });

      const associatedCategoryNames = associatedCategories
        .map((category) => category.name)
        .join(", ");

      const errorMessage = `Cannot delete categories. The following categories are associated with existing products: ${associatedCategoryNames}. Please delete the associated products first.`;

      return NextResponse.json(
        {
          message: errorMessage,
          associatedCategoryIds,
        },
        { status: 400 }
      );
    }

    const transaction = existingCategories.map((category) =>
      db.category.delete({ where: { id: category.id } })
    );

    await db.$transaction(transaction);

    await Promise.all(
      existingCategories.map((category) => {
        const publicId = category.images[0];
        if (publicId && !publicId.includes("default")) {
          return deleteImageFromCloudinary(publicId);
        }
        return Promise.resolve();
      })
    );

    revalidatePath("/catalog/categories");

    return NextResponse.json(
      { message: "Categories deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting categories:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting categories.", error },
      { status: 500 }
    );
  }
}
