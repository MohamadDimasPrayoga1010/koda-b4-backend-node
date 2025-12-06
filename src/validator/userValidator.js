import { checkSchema } from "express-validator";
import prisma from "../libs/prisma.js";

export const addUserValidation = checkSchema({
  fullname: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Fullname wajib diisi",
    },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Fullname minimal 3 karakter dan maksimal 100 karakter",
    },
    trim: true,
    matches: {
      options: [/^[a-zA-Z\s]+$/],
      errorMessage: "Fullname hanya boleh berisi huruf dan spasi",
    },
  },

  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Email wajib diisi",
    },
    isEmail: {
      errorMessage: "Format email tidak valid",
    },
    normalizeEmail: true,
    trim: true,
    custom: {
      options: async (value) => {
        const existingUser = await prisma.user.findUnique({
          where: { email: value },
        });
        if (existingUser) {
          throw new Error("Email sudah terdaftar");
        }
        return true;
      },
    },
  },

  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password wajib diisi",
    },
    isLength: {
      options: { min: 8, max: 100 },
      errorMessage: "Password minimal 8 karakter dan maksimal 100 karakter",
    },
    matches: {
      options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/],
      errorMessage: "Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka",
    },
  },

  phone: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    matches: {
      options: [/^(\+62|62|0)[0-9]{9,12}$/],
      errorMessage: "Format nomor telepon tidak valid (contoh: 081234567890 atau +6281234567890)",
    },
    trim: true,
  },

  address: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    isLength: {
      options: { min: 10, max: 500 },
      errorMessage: "Alamat minimal 10 karakter dan maksimal 500 karakter",
    },
    trim: true,
  },

  role: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    isIn: {
      options: [["user", "admin"]],
      errorMessage: "Role hanya boleh 'user' atau 'admin'",
    },
    trim: true,
  },
});

export const editUserValidation = checkSchema({
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "User ID wajib diisi",
    },
    isInt: {
      errorMessage: "User ID harus berupa angka",
    },
    toInt: true,
    custom: {
      options: async (value) => {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(value) },
        });
        if (!user) {
          throw new Error("User tidak ditemukan");
        }
        return true;
      },
    },
  },

  fullname: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Fullname minimal 3 karakter dan maksimal 100 karakter",
    },
    trim: true,
    matches: {
      options: [/^[a-zA-Z\s]+$/],
      errorMessage: "Fullname hanya boleh berisi huruf dan spasi",
    },
  },

  email: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    isEmail: {
      errorMessage: "Format email tidak valid",
    },
    normalizeEmail: true,
    trim: true,
    custom: {
      options: async (value, { req }) => {
        if (!value) return true;

        const userId = parseInt(req.params.id);
        const existingUser = await prisma.user.findUnique({
          where: { email: value },
        });

        if (existingUser && existingUser.id !== userId) {
          throw new Error("Email sudah digunakan oleh user lain");
        }
        return true;
      },
    },
  },

  password: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    isLength: {
      options: { min: 8, max: 100 },
      errorMessage: "Password minimal 8 karakter dan maksimal 100 karakter",
    },
    matches: {
      options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/],
      errorMessage: "Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka",
    },
  },

  phone: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    matches: {
      options: [/^(\+62|62|0)[0-9]{9,12}$/],
      errorMessage: "Format nomor telepon tidak valid (contoh: 081234567890 atau +6281234567890)",
    },
    trim: true,
  },

  address: {
    in: ["body"],
    optional: { options: { nullable: true, checkFalsy: true } },
    isLength: {
      options: { min: 10, max: 500 },
      errorMessage: "Alamat minimal 10 karakter dan maksimal 500 karakter",
    },
    trim: true,
  },
});