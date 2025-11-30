import express from "express";
import { adminOnly, authMiddleware } from "../middlewares/authMiddleware.js";
import { addToCart, createTransactionController, deleteCart, deleteTransaction, getAllTransactions, getCart, getTransactionById, getTransactionDetail, getTransactionHistoryController, updateTransactionStatus } from "../controllers/order.controler.js";

const router = express.Router();

router.post("/cart", authMiddleware, addToCart)
router.get("/cart", authMiddleware, getCart)
router.delete("/cart/:id", authMiddleware, deleteCart)
router.post("/transactions", authMiddleware, createTransactionController)
router.get("/transactions/history", authMiddleware, getTransactionHistoryController)
router.get("/transactions/history/:id", authMiddleware, getTransactionDetail)

router.get("/transactions", authMiddleware, adminOnly, getAllTransactions)
router.get("/transactions/:id", authMiddleware, adminOnly, getTransactionById)
router.patch("/transactions/:id/status", authMiddleware, adminOnly, updateTransactionStatus);
router.delete("/transactions/:id", authMiddleware, adminOnly, deleteTransaction)
export default router;
