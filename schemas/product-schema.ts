import * as z from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string({ message: "Product name is required" }),
  price: z
    .number({ message: "Product price is required" })
    .positive({ message: "Price must be positive" }),
  salePrice: z.number().default(-1),
  description: z.string({ message: "Product description is required" }),
  weight: z
    .string()
    .regex(/^\d+(\.\d+)?(kg|g)$/, {
      message: "Weight must be a valid format (e.g., 1kg, 500g)",
    })
    .optional(),
  stockCount: z
    .number({ message: "Stock count is required" })
    .int()
    .nonnegative({ message: "Stock count must be non-negative" }),
  category: z.string({ message: "Product category is required" }),
  images: z
    .array(
      z.string().refine((val) => val.startsWith("data:image/"), {
        message: "Invalid image format, should be base64-encoded string",
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});
