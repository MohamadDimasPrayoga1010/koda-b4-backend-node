import { checkSchema } from "express-validator";

export const createProductValidation = checkSchema({
  name: {
    notEmpty: {
      errorMessage: "Nama Product wajib diisi",
    },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Nama product minimal 3 karakter",
    },
    trim: true,
  },
  price: {
    notEmpty: {
      errorMessage: "Harga wajib diisi",
    },
    isFloat: {
      options: { min: 1 },
      errorMessage: "Harga harus berupa angka dan minimal 1",
    },
  },
});

export const updateProductValidation = checkSchema({
  id: {
    in: ["params"],
    isInt: {
      errorMessage: "ID harus berupa angka",
    },
  },
  name: {
    notEmpty: {
      errorMessage: "Nama Product wajib diisi",
    },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Nama product minimal 3 karakter",
    },
    trim: true,
  },
  price: {
    notEmpty: {
      errorMessage: "Harga wajib diisi",
    },
    isFloat: {
      options: { min: 1 },
      errorMessage: "Harga harus berupa angka dan minimal 1",
    },
  },
});
