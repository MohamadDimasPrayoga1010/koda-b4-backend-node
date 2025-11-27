import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getAllProductsController, getProductByIdController, updateProductController, uploadProductImageController } from "../controllers/products.controllers.js";
import { upload } from "../libs/uploads.js";


const router = express.Router();

router.post("", authMiddleware, adminOnly, createProductController);
router.post("/:id/upload", upload.array("images", 5), authMiddleware, adminOnly, uploadProductImageController)
router.get("", authMiddleware, getAllProductsController);
router.get("/:id", authMiddleware, getProductByIdController);
router.patch("/:id", authMiddleware, adminOnly, updateProductController);
router.delete("/:id", authMiddleware, adminOnly, deleteProductController)
export default router;
