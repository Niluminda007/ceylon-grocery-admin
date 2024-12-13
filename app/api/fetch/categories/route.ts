import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const categories = await db.category.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories.", error: error },
      { status: 500 }
    );
  }
}
