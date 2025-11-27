import { checkSchema } from "express-validator";

export const resgisterValidation = checkSchema({
  fullname: {
    notEmpty: {
      errorMessage: "Fullname wahib diisi",
    },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Fullname harus memiliki minimal 3 karakter",
    },
    trim: true,
  },
  email: {
    notEmpty: {
      errorMessage: "Email wajib diisi",
    },
    isEmail: {
      errorMessage: "Format email tidak valid",
    },
    normalizeEmail: true,
  },

  password: {
    notEmpty: {
      errorMessage: "Password wajib diisi",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password minimal 6 karakter",
    },
    trim: true,
  },
});

export const loginValidation = checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email wajib diisi",
    },
    isEmail: {
      errorMessage: "Format email tidak valid",
    },
    normalizeEmail: true,
  },

  password: {
    notEmpty: {
      errorMessage: "Password wajib diisi",
    },
    trim: true,
  },
});
