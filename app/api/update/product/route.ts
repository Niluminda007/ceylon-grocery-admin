import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSKU, slugify, toDecimal } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { ProductSchema } from "@/schemas/product-schema";
import { Product } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const product = await req.json();
    const validatedFields = ProductSchema.safeParse(product);
    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Validation error", error: validatedFields.error },
        { status: 400 }
      );
    }

    const {
      id,
      name,
      price,
      salePrice,
      description,
      weight,
      stockCount,
      category,
      images,
      tags,
    } = validatedFields.data;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    const [existingProduct, existingCategory] = await Promise.all([
      db.product.findUnique({ where: { id } }),
      db.category.findUnique({ where: { id: category } }),
    ]);

    if (!existingProduct) {
      return NextResponse.json("No product found for update", { status: 404 });
    }
    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const updateData: Partial<Product> = {};
    const newSlug = slugify(name);

    if (name !== existingProduct.name) {
      updateData.name = name;
      updateData.slug = newSlug;
    }
    if (toDecimal(price) !== existingProduct.price) {
      updateData.price = toDecimal(price);
    }
    if (toDecimal(salePrice) !== existingProduct.salePrice) {
      updateData.salePrice = toDecimal(salePrice);
    }
    if (description !== existingProduct.description) {
      updateData.description = description;
    }
    if (weight !== existingProduct.weight) {
      updateData.weight = weight;
    }
    if (stockCount !== existingProduct.stockCount) {
      updateData.stockCount = stockCount;
      updateData.inStock = stockCount > 0;
    }
    if (category !== existingProduct.category_id) {
      updateData.category_id = category;
      updateData.sku = generateSKU(name, existingProduct.category_id);
    }
    if (tags !== existingProduct.tags) {
      updateData.tags = tags;
    }

    if (images && images.length > 0) {
      const uploadedImages = await uploadImageToCloudinary(
        images[0],
        "ceylon-grocery/products/all-products",
        newSlug
      );
      if (uploadedImages.length > 0) {
        updateData.images = [...uploadedImages];
      }
    }
    const updatedProduct = await updateProductIfNeeded(id, updateData);
    revalidatePath(`/catalog/products/edit/${id}`);

    return NextResponse.json(
      { message: "Product Updated Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

async function updateProductIfNeeded(id: string, updateData: Partial<Product>) {
  if (Object.keys(updateData).length > 0) {
    return await db.product.update({
      where: { id },
      data: updateData,
    });
  }
  return null;
}
