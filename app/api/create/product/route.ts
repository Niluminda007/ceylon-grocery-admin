import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSKU, slugify } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { ProductSchema } from "@/schemas/product-schema";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

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
        { messsage: "Validation error", error: validatedFields.error },
        { status: 400 }
      );
    }
    const {
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

    const existingCategory = await db.category.findUnique({
      where: {
        id: category,
      },
    });
    if (!existingCategory) {
      return NextResponse.json(
        { message: "Error creating product. No category found" },
        { status: 500 }
      );
    }
    const slug = slugify(name);
    const categorySlug = existingCategory.slug;
    const newProduct = await db.product.create({
      data: {
        name,
        sku: generateSKU(name, existingCategory.id),
        slug,
        price,
        salePrice,
        description,
        weight,
        inStock: !!(stockCount > 0),
        stockCount,
        tags,
        category_id: category,
      },
    });

    const uploadedImages: string[] = [];
    let updatedNewProduct;
    if (images && images.length > 0) {
      const image = images[0];
      try {
        if (image) {
          const uploadResponse = await uploadImageToCloudinary(
            image,
            "ceylon-grocery/products/all-products",
            slug
          );
          uploadedImages.push(...uploadResponse);
        }
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
      }

      if (uploadedImages.length > 0) {
        updatedNewProduct = await db.product.update({
          where: { id: newProduct.id },
          data: { images: uploadedImages.map((url) => url) },
        });
      }
    } else {
      updatedNewProduct = await db.product.update({
        where: { id: newProduct.id },
        data: {
          images: [
            "ceylon-grocery/products/default_product_image/default-product.png",
          ],
        },
      });
    }
    return NextResponse.json(updatedNewProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating product.", error: error },
      { status: 500 }
    );
  }
}
