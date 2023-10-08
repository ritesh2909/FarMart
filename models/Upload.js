import { Schema, model } from "mongoose";

const uploadSchema = Schema(
  {
    userId: String,
    secretUrl: String,
    title: String,
    description: String,
  },
  { timestamps: true }
);


const Upload = model("Upload", uploadSchema);
export default Upload;
