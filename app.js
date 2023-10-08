import express, { json } from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import authRoute from "./routes/auth.js";
import uploadRoute from "./routes/upload.js";
import cron from "node-cron";
import Upload from "./models/Upload.js";
import cors from "cors";

const app = express();
config();
app.use(json());
app.use(cookieParser());
app.use(cors());
// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
} catch (error) {
  console.log("Error in creds");
  console.log(error);
}

// DB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);

cron.schedule("0 0 * * *", async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  await Upload.deleteMany({ createdAt: { $lt: threeDaysAgo } });
  console.log("Cron Jobs will delete Uploads after every 3 Days!");
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})

