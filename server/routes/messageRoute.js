import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMessages, uploadFile } from "../controller/messageController.js";
import multer from "multer";

const messagesRoutes = Router();

const upload = multer({dest: "uploads/files"});

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile)

export default messagesRoutes;