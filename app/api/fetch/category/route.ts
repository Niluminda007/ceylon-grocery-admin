import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const categoryId = req.nextUrl.searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json("category id is required", { status: 400 });
    }
    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        subCategories: true,
        parentCategory: true,
      },
    });
    if (!category) {
      return NextResponse.json("No category for given id found", {
        status: 404,
      });
    }
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching categories.", error: error },
      { status: 500 }
    );
  }
}
