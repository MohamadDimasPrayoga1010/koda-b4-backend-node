import prisma from "../libs/prisma.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  uploadProductImage,
} from "../models/products.models.js";

export async function createProductController(req, res) {
  try {
    const {
      title,
      description,
      base_price,
      stock,
      categoryIds,
      sizeIds,
      variantIds,
    } = req.body;

    if (!title || !base_price) {
      return res.status(400).json({
        success: false,
        message: "name and price must be filled in",
      });
    }

    const product = await createProduct({
      title,
      description,
      base_price: Number(base_price),
      stock: Number(stock),
      categoryIds: categoryIds || [],
      sizeIds: sizeIds || [],
      variantIds: variantIds || [],
    });

    res.status(201).json({
      success: true,
      message: "succeeded in making the product",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message,
    });
  }
}

export async function uploadProductImageController(req, res) {
  try {
    const productId = parseInt(req.params.id);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID harus diisi",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File images harus diupload",
      });
    }

    const imageRecords = await Promise.all(
      req.files.map((file) => uploadProductImage(productId, file.filename))
    );

    res.status(201).json({
      success: true,
      message: "Images berhasil diupload",
      data: imageRecords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal Upload",
      error: err.message,
    });
  }
}

export async function getAllProductsController(req, res) {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua product",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal Mengambil product",
      error: err.message,
    });
  }
}

export async function getProductByIdController(req, res) {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product dengan id ${id} tidak ditemukan`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil product",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal Mengambil product",
      error: err.message,
    });
  }
}

export async function updateProductController(req, res) {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product ID tidak valid",
      });
    }

    const {
      title,
      description,
      stock,
      base_price,
      categoryIds = [],
      sizeIds = [],
      variantIds = [],
    } = req.body || {};

    if (
      !title &&
      !description &&
      !stock &&
      !base_price &&
      !categoryIds.length &&
      !sizeIds.length &&
      !variantIds.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data untuk diupdate",
      });
    }

    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product tidak ditemukan",
      });
    }

    const updatedProduct = await updateProduct(productId, {
      title,
      description,
      stock,
      base_price,
      categoryIds,
      sizeIds,
      variantIds,
    });

    res.status(200).json({
      success: true,
      message: "Product berhasil diupdate",
      data: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal Update",
      error: err.message,
    });
  }
}

export async function deleteProductController(req, res) {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product ID tidak valid",
      });
    }

    const deleted = await deleteProduct(productId);

    res.status(200).json({
      success: true,
      message: "Product Berhasil di hapus",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus product",
      error: err.message,
    });
  }
}
