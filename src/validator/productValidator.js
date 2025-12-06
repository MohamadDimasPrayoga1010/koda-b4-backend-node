import { checkSchema } from "express-validator";

export const createProductValidation = checkSchema({
  title: {
    notEmpty: {
      errorMessage: "Nama product wajib diisi",
    },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Nama product minimal 3 karakter dan maksimal 100 karakter",
    },
    trim: true,
  },

  base_price: {
    notEmpty: {
      errorMessage: "Harga wajib diisi",
    },
    isFloat: {
      options: { min: 1 },
      errorMessage: "Harga harus berupa angka lebih dari 0",
    },
    toFloat: true,
  },

  stock: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Stock harus berupa angka dan minimal 1",
    },
    toInt: true,
  },

  description: {
    optional: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "Deskripsi maksimal 500 karakter",
    },
    trim: true,
  },

  categoryIds: {
    notEmpty: {
      errorMessage: "Kategori wajib diisi",
    },
  },

  sizeIds: {
    optional: true,
  },

  variantIds: {
    optional: true,
  },
});

export const updateProductValidation = checkSchema({
  id: {
    in: ["params"],
    isInt: {
      errorMessage: "ID harus berupa angka",
    },
    toInt: true,
  },

  title: {
    optional: { nullable: true },
    notEmpty: {
      errorMessage: "Nama product wajib diisi",
    },
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "Nama product minimal 3 karakter dan maksimal 100 karakter",
    },
    trim: true,
  },

  base_price: {
    optional: { nullable: true },
    isFloat: {
      options: { min: 1 },
      errorMessage: "Harga harus berupa angka dan minimal 1",
    },
    toFloat: true,
  },

  stock: {
    optional: { nullable: true },
    isInt: {
      options: { min: 1 },
      errorMessage: "Stock harus angka, minimal 1, dan tidak boleh 0 atau minus",
    },
    toInt: true,
  },

  description: {
    optional: { nullable: true },
    isLength: {
      options: { max: 500 },
      errorMessage: "Deskripsi maksimal 500 karakter",
    },
    trim: true,
  },

  categoryIds: {
    optional: { nullable: true },
  },

  sizeIds: {
    optional: { nullable: true },
  },

  variantIds: {
    optional: { nullable: true },
  },
});
