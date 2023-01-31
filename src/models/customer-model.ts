import { Schema, models, model } from "mongoose";

const customerSchema = new Schema({
  customer_name: String,
  address: String,
  contact_person: String,
  mobile: String,
});

const Customers = models.customers || model("customers", customerSchema);

export default Customers;
