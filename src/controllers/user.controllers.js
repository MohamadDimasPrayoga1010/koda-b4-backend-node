import { use } from "react";
import {
  createUserAdmin,
  deleteUserModel,
  editUserModel,
  getAllUser,
  getUserById,
} from "../models/user.model.js";



/**
 * GET /users
 * @summary Get all users with pagination & search
 * @tags User
 * @security bearerAuth
 *
 * @param {string} search.query - Search user by fullname or email (optional)
 * @param {number} page.query - Page number (default: 1)
 * @param {number} limit.query - Items per page (default: 10)
 *
 * @return {object} 200 - Users fetched successfully
 * @return {object} 500 - Failed to fetch users
 */
export async function getAllUsersController(req, res) {
  try {
    const { page, limit, search } = req.query;

    const { data, pagination, links } = await getAllUser({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || "",
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      pagination,
      links,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal Mengambil user",
      error: err.message,
    });
  }
}

/**
 * GET /users/{id}
 * @summary Get user detail by ID
 * @tags User
 * @security bearerAuth
 *
 * @param {number} id.path - User ID
 *
 * @return {object} 200 - User fetched successfully
 * @return {object} 400 - Invalid user ID
 * @return {object} 404 - User not found
 * @return {object} 500 - Failed to fetch user
 */
export async function getUserByIdController(req, res) {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak valid",
      });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const responseData = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile || {},
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: responseData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil user",
      error: err.message,
    });
  }
}

/**
 * POST /users
 * @summary Create a new user (Admin only)
 * @tags User
 * @security bearerAuth
 *
 * @description Membuat user baru dengan optional upload image (jpeg/jpg/png max 2MB).
 *
 * @param {string} fullname.formData.required - Fullname user
 * @param {string} email.formData.required - Email user
 * @param {string} password.formData.required - Password user
 * @param {string} phone.formData - Nomor telepon user (optional)
 * @param {string} address.formData - Alamat user (optional)
 * @param {string} role.formData - Role user (default: user)
 * @param {file} image.formData - Foto profil (jpeg/jpg/png max 2MB)
 *
 * @return {object} 201 - User berhasil dibuat
 * @return {object} 400 - Validasi gagal (input salah / file invalid)
 * @return {object} 500 - Gagal membuat user
 */
export async function addUserController(req, res) {
  try {
    const { fullname, email, password, phone, address, role } = req.body;
    const file = req.file;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fullname, email, dan password harus diisi",
      });
    }

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "File type tidak valid. Hanya jpeg, jpg, png yang diperbolehkan.",
        });
      }

      const maxSize = 2 * 1024 * 1024; 
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 2MB.",
        });
      }
    }

    const image = file ? file.filename : null;

    const newUser = await createUserAdmin({
      fullname,
      email,
      password,
      phone,
      address,
      role,
      image,
    });

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: newUser,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal membuat user baru",
      error: err.message,
    });
  }
}

/**
 * PATCH /users/{id}
 * @summary Update user data (fullname, email, password, phone, address, image)
 * @tags User
 * @security bearerAuth
 * @consumes multipart/form-data
 *
 * @param {number} id.path.required - ID user yang ingin diperbarui
 *
 * @param {string} fullname.formData - Fullname user
 * @param {string} email.formData - Email user
 * @param {string} password.formData - Password baru (optional)
 * @param {string} phone.formData - Nomor telepon user
 * @param {string} address.formData - Alamat user
 * @param {file} image.formData - Foto profil baru (jpeg/jpg/png max 2MB)
 *
 * @return {object} 200 - User berhasil diperbarui
 * @return {object} 400 - Validasi gagal (tipe file salah / ukuran besar / input tidak valid)
 * @return {object} 404 - User tidak ditemukan
 * @return {object} 500 - Gagal memperbarui user
 */
export async function editUserController(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { fullname, email, password, phone, address } = req.body;
    const file = req.file;

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "File type tidak valid. Hanya jpeg, jpg, png yang diperbolehkan.",
        });
      }

      const maxSize = 2 * 1024 * 1024; 
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 2MB.",
        });
      }
    }

    const updatedUser = await editUserModel({
      userId,
      fullname,
      email,
      password,
      phone,
      address,
      file, 
    });

    res.status(200).json({
      success: true,
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui user",
      error: err.message,
    });
  }
}


/**
 * DELETE /users/{id}
 * @summary Delete user by ID (Admin only)
 * @tags User
 * @security bearerAuth
 *
 * @description Menghapus user beserta relasi terkait (transaction, cart, forgotPassword, profile).
 *
 * @param {number} id.path.required - ID user yang akan dihapus
 *
 * @return {object} 200 - User berhasil dihapus
 * @return {object} 404 - User tidak ditemukan
 * @return {object} 500 - Gagal menghapus user
 */
export async function deleteUserController(req, res) {
  try {
    const userId = parseInt(req.params.id);

    const deletedUser = await deleteUserModel(userId);

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
      data: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus user",
      error: err.message,
    });
  }
}