import { Category, Discount, Product, Rating } from "@prisma/client";
import { ExtendedReview } from "../review";

export type ExtendedProduct = Product & {
  category: Category;
  discounts: Discount[];
  ratings: Rating[];
  reviews: ExtendedReview[];
};
