import { Schema, models, model } from "mongoose";

const categorySchema = new Schema({
  categoryName: String,
});

const Category = models.category || model("category", categorySchema);

export default Category;
