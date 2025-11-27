import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { createUser, findUserByEmail } from "../models/user.model.js";

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

    res.json({
      success: true,
      message: "Berhasil melakukan registrasi",
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({
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

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.APP_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
}
