import { Schema, models, model } from "mongoose";

const salesSchema = new Schema({
  salesTotal: Number,
  salesDate: Schema.Types.Date,
});

const Sales = models.sales || model("sales", salesSchema);

export default Sales;
