import { ProductType } from "./productTypes";

export interface CategoryType {
  category: string;
  products: Array<ProductType> | [];
}
