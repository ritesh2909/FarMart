import { Router } from "express";
const router = Router();
import multer, { memoryStorage } from "multer";
import verifyToken from "../middlewares/authMiddleware.js";
import {
  uploadNewFile,
  deleteUpload,
  getAllUploads,
  getAllUploadsV2
} from "../controllers/upload.js";

const storage = memoryStorage();
const upload = multer();

router.post("/upload", upload.single("image"), verifyToken, uploadNewFile);
router.delete("/remove/:id", verifyToken, deleteUpload);
router.get("/uploads", verifyToken, getAllUploads);
router.get("/all-uploads",getAllUploadsV2);

export default router;
