import { signIn } from "@/auth";
import { getAdminByUsername } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas/auth-schemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const values = await req.json();
    console.log(values);

    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
    }

    const { username, password } = validatedFields.data;

    const admin = await getAdminByUsername(username);

    if (!admin || !admin.username || !admin.password) {
      return NextResponse.json(
        { error: "Admin does not exist" },
        { status: 404 }
      );
    }

    const signInResult = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!signInResult || signInResult.error) {
      return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: true,
        url: DEFAULT_LOGIN_REDIRECT,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error logging in", details: error },
      { status: 500 }
    );
  }
}
