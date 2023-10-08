import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    accessToken: String,
    password: String,
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
