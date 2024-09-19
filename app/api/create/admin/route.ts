import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash("admin", 10);

    const testAdminCredentials = await db.admin.create({
      data: {
        username: "admin",
        password: hashedPassword,
      },
    });

    if (!testAdminCredentials) {
      return NextResponse.json(
        { message: "Failed to create admin credentials." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: testAdminCredentials }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating admin credentials.", error: error },
      { status: 500 }
    );
  }
}
