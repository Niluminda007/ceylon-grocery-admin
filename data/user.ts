import { db } from "@/lib/db";

export const getAdminByUsername = async (username: string) => {
  try {
    const admin = await db.admin.findFirst({
      where: {
        username,
      },
    });
    if (!admin) {
      return null;
    }

    return admin;
  } catch (error) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserByID = async (id: string | undefined) => {
  if (id === undefined) {
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
