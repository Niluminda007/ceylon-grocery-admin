import { currentUser } from "@/lib/auth";
import {
  getCloudinaryImageUrlFromPublicId,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { generateSKU, slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const reqBody = await req.json();
    const productIds: string[] = reqBody.productIds;

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        {
          message: "At least one product ID is required to duplicate products.",
        },
        { status: 400 }
      );
    }

    const existingProducts = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    if (existingProducts.length === 0) {
      return NextResponse.json(
        { message: "No valid products found to duplicate." },
        { status: 404 }
      );
    }

    const duplicatedProducts = [];
    const existingSlugs = new Set<string>();

    for (const product of existingProducts) {
      let baseSlug = slugify(`${product.slug}-copy`);
      let counter = 1;

      while (existingSlugs.has(baseSlug)) {
        baseSlug = slugify(`${product.slug}-copy-${counter}`);
        counter++;
      }
      existingSlugs.add(baseSlug);

      const newImages = [];
      if (product.images?.[0]) {
        const existingImageUrl = getCloudinaryImageUrlFromPublicId(
          product.images[0]
        );
        const uploadedImages = await uploadImageToCloudinary(
          existingImageUrl,
          "ceylon-grocery/products/all-products",
          baseSlug
        );
        newImages.push(...uploadedImages);
      }

      duplicatedProducts.push({
        ...product,
        name: `${product.name} - Copy`,
        sku: generateSKU(`${product.name}-Copy`, product.category_id),
        slug: baseSlug,
        images: newImages.length > 0 ? newImages : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await db.$transaction(
      duplicatedProducts.map((product) => db.product.create({ data: product }))
    );

    revalidatePath("/catalog/products");

    return NextResponse.json(
      { message: "Products duplicated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error duplicating products:", error);
    return NextResponse.json(
      { message: "Error duplicating products." },
      { status: 500 }
    );
  }
}
