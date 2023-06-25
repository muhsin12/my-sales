import { Schema, models, model } from "mongoose";

const PurchaseSchema = new Schema({
  purchaseName: String,
  price: Number,
  description: String,
  categoryId: Schema.Types.ObjectId,
});

const Purchases = models.purchases || model("purchases", PurchaseSchema);

export default Purchases;
