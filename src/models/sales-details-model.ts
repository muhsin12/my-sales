import { Schema, models, model } from "mongoose";

const salesDetailsSchema = new Schema({
  salesId: Schema.Types.ObjectId,
  itemName: String,
  price: Number,
  itemId: Schema.Types.ObjectId,
  quantity: Number,
  itemPrice: Number,
});

const SalesDetails =
  models.salesDetails || model("salesDetails", salesDetailsSchema);

export default SalesDetails;
