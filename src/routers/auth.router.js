import express from "express";
import { loginValidation, resgisterValidation } from "../validator/authValidator.js";
import { validate } from "../libs/validate.js";
import { login, register } from "../controllers/auth.controllers.js";




const router = express.Router();

router.post("/register",resgisterValidation,validate ,register);
router.post("/login", loginValidation, validate, login);

export default router;
