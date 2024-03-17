import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  username: Schema.Types.String,
  password: Schema.Types.String,
  role: Schema.Types.String,
});

const Users = models.users || model("users", userSchema);

export default Users;
