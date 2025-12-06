import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addUserController,
  deleteUserController,
  editUserController,
  getAllUsersController,
  getUserByIdController,
  getUserProfileController,
  updateUserProfileController,
} from "../controllers/user.controllers.js";
import { upload } from "../libs/uploads.js";
import { multerErrorHandler } from "../libs/multerHandler.js";
import {
  addUserValidation,
  editUserValidation,
} from "../validator/userValidator.js";
import { validate } from "../libs/validate.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfileController);
router.patch(
  "/profile",
  authMiddleware,
  upload.single("image"),
  updateUserProfileController,
  multerErrorHandler
);
router.get("/", authMiddleware, adminOnly, getAllUsersController);
router.get("/:id", authMiddleware, adminOnly, getUserByIdController);
router.post(
  "/",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  multerErrorHandler,
  addUserValidation,
  validate,
  addUserController
);

router.patch(
  "/:id",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  multerErrorHandler,
  editUserValidation,
  validate,
  editUserController
);

router.delete("/:id", authMiddleware, adminOnly, deleteUserController);

export default router;
