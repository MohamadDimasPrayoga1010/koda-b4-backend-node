import { use } from "react";
import {
  createUserAdmin,
  deleteUserModel,
  editUserModel,
  getAllUser,
  getUserById,
} from "../models/user.model.js";




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