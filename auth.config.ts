export const runtime = "nodejs";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

import { LoginSchema } from "./schemas/auth-schemas";
import { getAdminByUsername } from "./data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { username, password } = validatedFields.data;

          const admin = await getAdminByUsername(username);

          if (!admin || !admin.password) return null;

          const passwordMatch = await bcrypt.compare(password, admin.password);

          if (passwordMatch) return admin;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
