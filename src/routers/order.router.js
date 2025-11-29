import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addToCart, createTransactionController, deleteCart, getCart } from "../controllers/order.controler.js";

const router = express.Router();

router.post("/cart", authMiddleware, addToCart)
router.get("/cart", authMiddleware, getCart)
router.delete("/cart/:id", authMiddleware, deleteCart)
router.post("/transaction", authMiddleware, createTransactionController)

export default router;
