import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware.js";
import { addUserController, deleteUserController, editUserController, getAllUsersController, getUserByIdController, getUserProfileController, updateUserProfileController } from "../controllers/user.controllers.js";
import { upload } from "../libs/uploads.js";
import { multerErrorHandler } from "../libs/multerHandler.js";



const router = express.Router();

router.get("/profile", authMiddleware, getUserProfileController)
router.patch("/profile", authMiddleware, upload.single("image") ,updateUserProfileController,multerErrorHandler)
router.get("/", authMiddleware, adminOnly, getAllUsersController)
router.get("/:id", authMiddleware, adminOnly, getUserByIdController)
router.post("/", upload.single("image"), authMiddleware, multerErrorHandler ,adminOnly, addUserController)
router.patch("/:id", authMiddleware, upload.single("image"),multerErrorHandler ,editUserController, adminOnly);
router.delete("/:id", authMiddleware, adminOnly, deleteUserController);


export default router;
