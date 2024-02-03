import { Schema, models, model } from "mongoose";
var CounterSchema = new Schema({
  id: { type: String },
  seq: { type: Number },
});

const Counter = models.counter || model("counter", CounterSchema);

export default Counter;
