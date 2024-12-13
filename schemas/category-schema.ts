import * as z from "zod";

export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string({ message: "Category name is required" }),
  description: z.string({ message: "Product description is required" }),
  parentCategory: z.array(z.string()).optional(),
  subCategory: z.array(z.string()).optional(),
  images: z
    .array(
      z.string().refine((val) => val.startsWith("data:image/"), {
        message: "Invalid image format, should be base64-encoded string",
      })
    )
    .optional(),
});
