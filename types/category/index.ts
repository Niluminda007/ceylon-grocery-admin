import { Category } from "@prisma/client";

export type CategoryExtended = Category & {
  parentCategories: Category[];
  subCategories: Category[];
};
