import { currentUser } from "@/lib/auth";
import {
  getCloudinaryImageUrlFromPublicId,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Duplicate categories
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const reqBody = await req.json();
    const categoryIds: string[] = reqBody.categoryIds;

    if (!categoryIds || categoryIds.length === 0) {
      return NextResponse.json(
        {
          message:
            "At least one category ID is required to duplicate categories.",
        },
        { status: 400 }
      );
    }

    const existingCategories = await db.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        name: true,
        description: true,
        slug: true,
        images: true,
      },
    });

    if (existingCategories.length === 0) {
      return NextResponse.json(
        { message: "No valid categories found to duplicate." },
        { status: 404 }
      );
    }

    const maxSortOrderResult = await db.category.aggregate({
      _max: { sortOrder: true },
    });
    let nextSortOrder = (maxSortOrderResult._max.sortOrder ?? 0) + 1;

    const duplicatedCategories = [];
    const existingSlugs = new Set<string>();

    for (const category of existingCategories) {
      let baseName = `${category.name}-Copy`;
      let baseSlug = slugify(`${category.slug}-Copy`);
      let counter = 1;

      while (existingSlugs.has(baseSlug)) {
        baseSlug = slugify(`${category.slug}-Copy-${counter}`);
        counter++;
      }
      existingSlugs.add(baseSlug);

      const existingImageUrl = getCloudinaryImageUrlFromPublicId(
        category.images[0]
      );
      const newImages = await uploadImageToCloudinary(
        existingImageUrl,
        "ceylon-grocery/categories",
        baseSlug
      );
      duplicatedCategories.push({
        name: baseName,
        slug: baseSlug,
        sortOrder: nextSortOrder++,
        description: category.description,
        images: [...newImages],
      });
    }

    await db.$transaction(
      duplicatedCategories.map((data) => db.category.create({ data }))
    );

    revalidatePath("/catalog/categories");

    return NextResponse.json(
      { message: "Categories duplicated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error duplicating categories:", error);
    return NextResponse.json(
      { message: "Error duplicating categories." },
      { status: 500 }
    );
  }
}
