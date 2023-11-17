import { Router } from "express";
import { registerUser,getUsers, loginUser, logoutUser } from "../controllers/auth.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/users", getUsers);
export default router;

