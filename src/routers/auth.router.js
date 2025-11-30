import express from "express";
import { loginValidation, resgisterValidation } from "../validator/authValidator.js";
import { validate } from "../libs/validate.js";
import { forgotPassword, login, register, resetPasswordController, verifyOtp } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register",resgisterValidation,validate ,register);
router.post("/login", loginValidation, validate, login);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp)
router.patch('/reset-password', resetPasswordController);


export default router;
