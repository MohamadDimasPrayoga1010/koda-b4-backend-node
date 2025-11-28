import { createPagination } from "../libs/pagination.js";
import prisma from "../libs/prisma.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  uploadProductImage,
} from "../models/products.models.js";

/**
 * POST /products
 * @summary Create a new product
 * @tags Product
 * @security bearerAuth
 * @consumes multipart/form-data
 *
 * @param {string} title.formData.required - Product title
 * @param {string} description.formData - Product description
 * @param {number} base_price.formData.required - Base price
 * @param {number} stock.formData - Stock quantity
 * @param {string} categoryIds.formData - JSON array of category IDs
 * @param {string} sizeIds.formData - JSON array of size IDs
 * @param {string} variantIds.formData - JSON array of variant IDs
 * @param {file[]} images.formData - Product images (multiple files allowed, jpeg/jpg/png max 2MB)
 *
 * @return {object} 201 - Product created successfully
 * @return {object} 400 - Missing required fields or invalid file
 * @return {object} 401 - Unauthorized (invalid/missing token)
 * @return {object} 500 - Server error
 */
export async function createProductController(req, res) {
  try {
    const files = req.files || [];
    const data = req.body;

    if (!data.title || !data.base_price) {
      return res.status(400).json({
        success: false,
        message: "Title and base_price must be filled in",
      });
    }

    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (files.length > 0) {
      for (const file of files) {
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `File "${file.originalname}" tidak valid. Hanya jpeg, jpg, png yang diizinkan.`,
          });
        }

        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            message: `File "${file.originalname}" terlalu besar. Maksimal 2MB.`,
          });
        }
      }
    }

    function parseIds(str, fieldName) {
      if (!str) return [];
      return str.split(",").map(id => {
        const n = Number(id.trim());
        if (isNaN(n)) throw new Error(`${fieldName} harus berupa angka`);
        return n;
      });
    }

    const categoryIds = parseIds(data.categoryIds, "categoryIds");
    const sizeIds = parseIds(data.sizeIds, "sizeIds");
    const variantIds = parseIds(data.variantIds, "variantIds");

    const product = await createProduct({
      ...data,
      categoryIds,
      sizeIds,
      variantIds,
    }, files);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        id: product.id,
        title: product.title,
        description: product.description,
        basePrice: product.base_price,
        stock: product.stock,
        categories: product.categories.map(c => ({
          id: c.category.id,
          name: c.category.name,
        })),
        sizes: product.sizes.map(s => ({
          id: s.size.id,
          name: s.size.name,
          additionalPrice: s.size.additional_price,
        })),
        variants: product.variants.map(v => ({
          id: v.variant.id,
          name: v.variant.name,
          additionalPrice: v.variant.additional_price,
        })),
        images: product.images.map(i => ({
          productId: i.productId,
          image: i.image,
          updatedAt: i.updated_at,
        })),
      },
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

/**
 * GET /products
 * @summary Get all products with pagination, search & sorting
 * @tags Product
 * @security bearerAuth
 *
 * @param {string} search.query - Search by product title (optional)
 * @param {number} page.query - Page number (default: 1)
 * @param {number} limit.query - Items per page (default: 10)
 * @param {string} sort.query - Sort products by price: "termurah" (harga termurah) "termahal" (harga termahal) (optional)
 *
 * @return {object} 200 - List of products
 * @return {object} 500 - Failed to fetch products
 */
export async function getAllProductsController(req, res) {
  try {
    let { search = "", page = 1, limit = 10, sort = "" } = req.query;

    page = Number(page);
    limit = Number(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (typeof search !== "string") search = "";

    const { products, totalItems } = await getAllProducts({
      search,
      page,
      limit,
      sort,
    });

    const pagination = createPagination({
      totalItems,
      page,
      limit,
      baseUrl: "/products",
      sort,
    });

    const data = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      basePrice: p.base_price,
      stock: p.stock,
      categoryId: p.categories[0]?.category?.id || null,
      image: p.images[0]?.image || null,
      sizes: p.sizes.map((s) => ({
        id: s.size.id,
        name: s.size.name,
      })),
      variants: p.variants.map((v) => ({
        id: v.variant.id,
        name: v.variant.name,
        additional_price: v.variant.additional_price,
      })),
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    res.status(200).json({
      success: true,
      message: "Filtered products fetched successfully",
      ...pagination,
      data,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil product",
      error: err.message,
    });
  }
}

/**
 * GET /products/{id}
 * @summary Get product detail by ID
 * @tags Product
 * @security bearerAuth
 *
 * @param {number} id.path - Product ID
 *
 * @return {object} 200 - Product detail
 * @return {object} 404 - Product not found
 * @return {object} 500 - Failed to fetch product
 */
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
      message: "Product fetched successfully",
      data: {
        ...product,
        category: product.categories[0]?.category || null,
        variants: product.variants.map(v => ({
          id: v.variant.id,
          name: v.variant.name,
          additionalPrice: v.variant.additional_price,
        })),
        sizes: product.sizes.map(s => ({
          id: s.size.id,
          name: s.size.name,
          additionalPrice: s.size.additional_price,
        })),
        images: product.images.map(i => ({
          productId: i.productId,
          image: i.image,
          updatedAt: i.updated_at,
        })),
      },
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

/**
 * PATCH /products/{id}
 * @summary Update product
 * @tags Product
 * @security bearerAuth
 *
 * @param {number} id.path - Product ID
 *
 * @param {string} title.formData - Product title (optional)
 * @param {string} description.formData - Product description (optional)
 * @param {number} stock.formData - Product stock (optional)
 * @param {number} base_price.formData - Base price (optional)
 *
 * @param {string} categoryIds.formData - Array of category IDs (JSON string) - optional
 * @param {string} sizeIds.formData - Array of size IDs (JSON string) - optional
 * @param {string} variantIds.formData - Array of variant IDs (JSON string) - optional
 *
 * @param {array<string>} files.formData - Product images (jpg, jpeg, png) - optional
 *
 * @return {object} 200 - Product updated successfully
 * @return {object} 400 - Invalid input or no data to update
 * @return {object} 404 - Product not found
 * @return {object} 500 - Failed to update product
 */
export async function updateProductController(req, res) {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID tidak valid" 
      });
    }

    const body = req.body || {};
    const files = req.files || [];

    const title = body.title?.trim() || undefined;
    const description = body.description?.trim() || undefined;
    const stock = body.stock != null && body.stock !== "" ? Number(body.stock) : undefined;
    const base_price = body.base_price != null && body.base_price !== "" ? Number(body.base_price) : undefined;

    let categoryIds = [];
    if (body.categoryIds) {
      if (Array.isArray(body.categoryIds)) {
        categoryIds = body.categoryIds.map(Number).filter(n => !isNaN(n));
      } else if (typeof body.categoryIds === "string") {
        categoryIds = body.categoryIds
          .split(",")
          .map(v => Number(v.trim()))
          .filter(n => !isNaN(n));
      }
    }

    let sizeIds = [];
    if (body.sizeIds) {
      if (Array.isArray(body.sizeIds)) {
        sizeIds = body.sizeIds.map(Number).filter(n => !isNaN(n));
      } else if (typeof body.sizeIds === "string") {
        sizeIds = body.sizeIds
          .split(",")
          .map(v => Number(v.trim()))
          .filter(n => !isNaN(n));
      }
    }

    let variantIds = [];
    if (body.variantIds) {
      if (Array.isArray(body.variantIds)) {
        variantIds = body.variantIds.map(Number).filter(n => !isNaN(n));
      } else if (typeof body.variantIds === "string") {
        variantIds = body.variantIds
          .split(",")
          .map(v => Number(v.trim()))
          .filter(n => !isNaN(n));
      }
    }

    if (files.length > 0) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 2 * 1024 * 1024; 

      for (const file of files) {
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `File "${file.originalname}" tidak valid. Hanya jpeg, jpg, png yang diizinkan.`,
          });
        }
        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            message: `File "${file.originalname}" terlalu besar. Maksimal 2MB.`,
          });
        }
      }
    }

    if (
      title === undefined &&
      description === undefined &&
      stock === undefined &&
      base_price === undefined &&
      categoryIds.length === 0 &&
      sizeIds.length === 0 &&
      variantIds.length === 0 &&
      files.length === 0
    ) {
      return res.status(400).json({ 
        success: false, 
        message: "Tidak ada data untuk diupdate" 
      });
    }

    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Product tidak ditemukan" 
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (stock !== undefined) updateData.stock = stock;
    if (base_price !== undefined) updateData.base_price = base_price;

    if (categoryIds.length > 0) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map(catId => ({ category: { connect: { id: catId } } })),
      };
    }

    if (sizeIds.length > 0) {
      updateData.sizes = {
        deleteMany: {},
        create: sizeIds.map(sizeId => ({ size: { connect: { id: sizeId } } })),
      };
    }

    if (variantIds.length > 0) {
      updateData.variants = {
        deleteMany: {},
        create: variantIds.map(variantId => ({ variant: { connect: { id: variantId } } })),
      };
    }

    if (files.length > 0) {
      const imageData = files.map(file => ({ image: file.path }));
      updateData.images = {
        create: imageData,
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        categories: { include: { category: true } },
        sizes: { include: { size: true } },
        variants: { include: { variant: true } },
        images: true,
      },
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
      error: err.message 
    });
  }
}


/**
 * DELETE /products/{id}
 * @summary Delete product by ID
 * @tags Product
 * @security bearerAuth
 *
 * @param {number} id.path - Product ID
 *
 * @return {object} 200 - Product deleted successfully
 * @return {object} 400 - Invalid product ID
 * @return {object} 404 - Product not found
 * @return {object} 500 - Failed to delete product
 */

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
