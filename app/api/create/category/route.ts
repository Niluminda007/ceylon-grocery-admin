import { currentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { CategorySchema } from "@/schemas/category-schema";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauhorized" }, { status: 403 });
    }
    const category = await req.json();
    const validatedFields = CategorySchema.safeParse(category);
    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "validation error", error: validatedFields.error },
        { status: 400 }
      );
    }

    const { name, description, images } = validatedFields.data;

    const existingCategory = await db.category.findFirst({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "A Category by this name already exists" },
        { status: 400 }
      );
    }
    const slug = slugify(name);

    let newSortOrder = -1;
    const maxSortOrder = await db.category.aggregate({
      _max: { sortOrder: true },
    });
    newSortOrder = (maxSortOrder._max.sortOrder ?? 0) + 1;

    const newCategory = await db.category.create({
      data: {
        name,
        description,
        sortOrder: newSortOrder,
        slug,
      },
    });

    const uploadedImages: string[] = [];

    if (images && images.length > 0) {
      const image = images[0];

      if (image) {
        const uploadResponse = await uploadImageToCloudinary(
          image,
          "ceylon-grocery/categories",
          slug
        );
        uploadedImages.push(...uploadResponse);
      }
      if (uploadedImages.length > 0) {
        await db.category.update({
          where: {
            id: newCategory.id,
          },
          data: {
            images: uploadedImages.map((url) => url),
          },
        });
      }
    } else {
      await db.category.update({
        where: {
          id: newCategory.id,
        },
        data: {
          images: ["ceylon-grocery/default/default-image.png"],
        },
      });
    }
    return NextResponse.json(
      { message: "Category Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating product.", error: error },
      { status: 500 }
    );
  }
}
