import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { createUser, findUserByEmail } from "../models/user.model.js";
import { generateOTP, otpExpiry } from "../libs/otp.js";
import { sendOTPEmail } from "../libs/mailer.js";
import { createOrUpdateForgotPassword, deleteForgotPasswordByUserId, getAllActiveForgotPasswords, getForgotPasswordByUserId, updateUserPassword } from "../models/auth.models.js";


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

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email wajib diisi"
      });
    }

    const user = await findUserByEmail(email);
    
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Email tidak terdaftar"
      });
    }

    const otp = generateOTP(6);
    const hashedOTP = await argon2.hash(otp);
    const expiresAt = otpExpiry(2);

    await createOrUpdateForgotPassword(user.id, hashedOTP, expiresAt);
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim ke email Anda"
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
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
        success: false,
        message: "Email dan OTP wajib diisi"
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Format OTP tidak valid"
      });
    }

    const user = await findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "OTP tidak valid atau sudah kadaluarsa"
      });
    }

    const forgotPassword = await getForgotPasswordByUserId(user.id);
    
    if (!forgotPassword || !forgotPassword.token) {
      return res.status(401).json({
        success: false,
        message: "OTP tidak valid atau sudah kadaluarsa"
      });
    }

    if (new Date() > forgotPassword.expires_at) {
      return res.status(401).json({
        success: false,
        message: "OTP tidak valid atau sudah kadaluarsa"
      });
    }

    let isValidOTP = false;
    try {
      isValidOTP = await argon2.verify(forgotPassword.token, otp);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "OTP tidak valid atau sudah kadaluarsa"
      });
    }
    
    if (!isValidOTP) {
      return res.status(401).json({
        success: false,
        message: "OTP tidak valid atau sudah kadaluarsa"
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP berhasil diverifikasi"
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
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
export async function resetPasswordController(req, res) {
  try {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "OTP dan password baru wajib diisi"
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Format OTP tidak valid"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter"
      });
    }

    const allForgotPasswords = await getAllActiveForgotPasswords();
    
    let validUser = null;
    
    for (const record of allForgotPasswords) {
      try {
        const isMatch = await argon2.verify(record.token, otp);
        if (isMatch) {
          validUser = record;
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (!validUser) {
      return res.status(401).json({
        success: false,
        message: "OTP tidak valid atau sudah kadaluarsa"
      });
    }

    const hashedPassword = await argon2.hash(newPassword);
    await updateUserPassword(validUser.userId, hashedPassword);
    await deleteForgotPasswordByUserId(validUser.userId);

    return res.status(200).json({
      success: true,
      message: "Password berhasil direset"
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
    });
  }
}