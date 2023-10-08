import { Router } from "express";
const router = Router();
import multer, { memoryStorage } from "multer";
import verifyToken from "../middlewares/authMiddleware.js";
import {
  uploadNewFile,
  deleteUpload,
  getAllUploads,
} from "../controllers/upload.js";

const storage = memoryStorage();
const upload = multer();

router.post("/upload", upload.single("image"), verifyToken, uploadNewFile);
router.delete("/remove/:id", verifyToken, deleteUpload);
router.get("/uploads", verifyToken, getAllUploads);

export default router;
