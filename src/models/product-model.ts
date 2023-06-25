import { Schema, models, model } from "mongoose";

const productSchema = new Schema({
  productName: String,
  price: Number,
  description: String,
  categoryId: Schema.Types.ObjectId,
});

const Products = models.products || model("products", productSchema);

export default Products;
