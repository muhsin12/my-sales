import { Schema, models, model } from "mongoose";

const categorySchema = new Schema({
  categoryName: String,
});

const PurchaseCategory =
  models.purchaseCategory || model("purchaseCategory", categorySchema);

export default PurchaseCategory;
