import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  lowercaseFirstChars,
  replaceSpacesWithUnderscores,
  slugify,
} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CategorySchema } from "@/schemas/category-schema";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const category = await req.json();
    const validatedFields = CategorySchema.safeParse(category);
    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Validation error", error: validatedFields.error },
        { status: 400 }
      );
    }

    const { id, name, images, description } = validatedFields.data;

    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required." },
        { status: 400 }
      );
    }

    const existingCategory = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const categoryUrlPath = replaceSpacesWithUnderscores(
      lowercaseFirstChars(name)
    );

    const updateData: Partial<Category> = {};

    const newSlug = slugify(name);

    if (name !== existingCategory.name) {
      updateData.name = name;
      updateData.slug = newSlug;
    }

    if (description !== existingCategory.description) {
      updateData.description = description;
    }

    if (images && images.length > 0) {
      const uploadedImages = await uploadImageToCloudinary(
        images[0],
        "ceylon-grocery/categories",
        newSlug
      );
      if (uploadedImages.length > 0) {
        updateData.images = [...uploadedImages];
      }
    }
    await updateCategoryIfNeeded(id, updateData);
    revalidatePath(`/catalog/categories/edit/${id}`);

    return NextResponse.json(
      { message: "Category Updated Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating Category:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

async function updateCategoryIfNeeded(
  id: string,
  updateData: Partial<Category>
) {
  if (Object.keys(updateData).length > 0) {
    return await db.category.update({
      where: { id },
      data: updateData,
    });
  }
  return null;
}
