import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Product name is required"],
  },
  price: {
    type: Number,
    required: [true, "Product should have a price"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
  weight: {
    type: String,
    required: [true, "Product weight is required"],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

const Product = models.Product || model("Product", ProductSchema);
export default Product;
