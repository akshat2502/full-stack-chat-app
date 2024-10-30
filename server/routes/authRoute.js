import { Router } from "express";
import { signup, login, getUserInfo, updateprofile, addprofileimage, removeprofileimage, logOut } from "../controller/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({ dest: 'uploads/profiles/' });

authRoutes.post("/signup",signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logOut);

authRoutes.get("/user-info", verifyToken, getUserInfo);

authRoutes.post("/update-profile", verifyToken, updateprofile);

authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addprofileimage);

authRoutes.delete("/remove-profile-image", verifyToken, removeprofileimage);

export default authRoutes;