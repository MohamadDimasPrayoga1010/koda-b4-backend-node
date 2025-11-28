import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getAllProductsController, getProductByIdController, updateProductController, uploadProductImageController } from "../controllers/products.controllers.js";
import { upload } from "../libs/uploads.js";
import { validate } from "../libs/validate.js";
import { createProductValidation, updateProductValidation } from "../validator/productValidator.js";
import { multerErrorHandler } from "../libs/multerHandler.js";

const router = express.Router();

router.post("", upload.array("images", 4), authMiddleware,validate,createProductValidation, multerErrorHandler ,adminOnly, createProductController);
router.post("/:id/upload", upload.array("images", 5), multerErrorHandler,uploadProductImageController)
router.get("", authMiddleware, getAllProductsController);
router.get("/:id", authMiddleware, getProductByIdController);
router.patch("/:id", authMiddleware,validate,upload.array("images", 5) ,updateProductValidation, adminOnly, multerErrorHandler,updateProductController);
router.delete("/:id", authMiddleware, adminOnly, deleteProductController)
export default router;
