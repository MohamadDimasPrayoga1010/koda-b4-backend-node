import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addToCart, createTransactionController, deleteCart, getCart, getTransactionDetail, getTransactionHistoryController } from "../controllers/order.controler.js";

const router = express.Router();

router.post("/cart", authMiddleware, addToCart)
router.get("/cart", authMiddleware, getCart)
router.delete("/cart/:id", authMiddleware, deleteCart)
router.post("/transaction", authMiddleware, createTransactionController)
router.get("/transactions/history", authMiddleware, getTransactionHistoryController)
router.get("/transactions/history/:id", authMiddleware, getTransactionDetail)

export default router;
