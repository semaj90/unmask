import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    address: String,
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
