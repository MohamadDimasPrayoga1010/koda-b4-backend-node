import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware.js";
import { addUserController, deleteUserController, editUserController, getAllUsersController, getUserByIdController } from "../controllers/user.controllers.js";
import { upload } from "../libs/uploads.js";



const router = express.Router();


router.get("/", authMiddleware, adminOnly, getAllUsersController)
router.get("/:id", authMiddleware, adminOnly, getUserByIdController)
router.post("/", upload.single("image"), authMiddleware, adminOnly, addUserController)
router.patch("/:id", authMiddleware, upload.single("image"), editUserController, adminOnly);
router.delete("/:id", authMiddleware, adminOnly, deleteUserController);
export default router;





;