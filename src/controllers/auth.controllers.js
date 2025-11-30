import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { createUser, findUserByEmail } from "../models/user.model.js";
import { generateOTP, otpExpiry } from "../libs/otp.js";
import { sendOTPEmail } from "../libs/mailer.js";
import { clearUserOtp, findUserByOtp, setUserOtp, setUserPassword } from "../models/auth.models.js";


/**
 * POST /auth/register
 * @summary login user
 * @tags Auth
 * @param {object} request.body.required - Body request
 * @param  {string} fullname.form.required - fullname of user - application/x-www-form-urlencoded
 * @param  {string} email.form.required - Email of user - application/x-www-form-urlencoded
 * @param  {string} password.form.required - Password of user - application/x-www-form-urlencoded
 * @return {object} 200 - Sukses response
 * @return {object} 401 - email or password correct
 */
export async function register(req, res) {
  const { fullname, email, password, role, admin_secret } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });

    let finalRole = "user";
    if (role === "admin") {
      if (admin_secret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({
          success: false,
          message: "Admin secret invalid",
        });
      }
      finalRole = "admin";
    }

    const newUser = await createUser(fullname, email, password, finalRole);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.created_at,
        updatedAt: newUser.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi Kesalahan server",
      error: err.message,
    });
  }
}

/**
 * POST /auth/login
 * @summary login user
 * @tags Auth
 * @param {object} request.body.required - Body request
 * @param  {string} email.form.required - Email of user - application/x-www-form-urlencoded
 * @param  {string} password.form.required - Password of user - application/x-www-form-urlencoded
 * @return {object} 200 - Sukses response
 * @return {object} 401 - email or password correct
 */
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword)
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.APP_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Login success",
      data: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        token,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
}

/**
 * POST /auth/forgot-password
 * @summary Request OTP for reset password
 * @tags Auth
 * @param {object} request.body.required - Body request
 * @param {string} email.form.required - User email - application/x-www-form-urlencoded
 * @return {object} 200 - OTP sent successfully
 * @return {object} 404 - Email not found
 * @return {object} 500 - Failed to send OTP
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Email tidak ditemukan",
      });
    }

    const otp = generateOTP();       
    const expires = otpExpiry(2);     

    await setUserOtp(email, otp, expires);

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      status: true,
      message: "OTP berhasil dikirim ke email",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server",
    });
  }
}


/**
 * POST /auth/verify-otp
 * @summary Verify OTP for password reset
 * @tags Auth
 * @param {object} request.body.required
 * @param {string} email.form.required - Email user - application/x-www-form-urlencoded
 * @param {string} otp.form.required - Kode OTP - application/x-www-form-urlencoded
 * @return {object} 200 - OTP valid, token diberikan
 * @return {object} 400 - OTP salah atau expired
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: false,
        message: "Email dan OTP wajib diisi",
      });
    }

    const user = await findUserByOtp(email, otp);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "OTP salah atau sudah kadaluarsa",
      });
    }

    return res.status(200).json({
      status: true,
      message: "OTP berhasil diverifikasi",
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}


/**
 * PATCH /auth/reset-password
 * @summary Reset password user
 * @tags Auth
 * @param {object} request.body.required
 * @param {string} email.form.required - Email user - application/x-www-form-urlencoded
 * @param {string} newPassword.form.required - Password baru minimal 6 karakter - application/x-www-form-urlencoded
 * @return {object} 200 - Password berhasil di-reset
 * @return {object} 400 - Email tidak ditemukan atau request invalid
 */
export const resetPasswordController = async (req, res) => {
   try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Email dan password baru wajib diisi",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Email tidak ditemukan",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    await setUserPassword(user.id, hashedPassword);

    await clearUserOtp(user.id);

    return res.status(200).json({
      status: true,
      message: "Password berhasil di-reset",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};