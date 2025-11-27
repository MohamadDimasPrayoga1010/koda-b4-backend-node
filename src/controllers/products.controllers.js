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
 * @param {string} title.form.required - Product title - multipart/form-data
 * @param {string} description.form - Product description - multipart/form-data
 * @param {number} base_price.form.required - Base price - multipart/form-data
 * @param {number} stock.form - Stock quantity - multipart/form-data
 * @param {string} categoryIds.form - JSON array of category IDs - multipart/form-data
 * @param {string} sizeIds.form - JSON array of size IDs - multipart/form-data
 * @param {string} variantIds.form - JSON array of variant IDs - multipart/form-data
 * @param {file} images.form - Product images (multiple) - multipart/form-data
 * @return {object} 201 - Product created successfully
 * @return {object} 400 - Missing required fields
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
        if (file.invalid || !allowedTypes.includes(file.mimetype)) {
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

    const product = await createProduct(data, files);

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

export async function getAllProductsController(req, res) {
  try {
    let { search = "", page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (typeof search !== "string") search = "";

    const { products, totalItems } = await getAllProducts({ search, page, limit });

    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const backPage = page > 1 ? page - 1 : null;

    const data = products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      basePrice: p.base_price,
      stock: p.stock,
      categoryId: p.categories[0]?.category?.id || null,
      image: p.images[0]?.image || null,
      sizes: p.sizes.map(s => ({
        id: s.size.id,
        name: s.size.name,
      })),
      variants: p.variants.map(v => ({
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
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
      links: {
        next: nextPage ? `/products?limit=${limit}&page=${nextPage}` : null,
        back: backPage ? `/products?limit=${limit}&page=${backPage}` : null,
      },
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

export async function updateProductController(req, res) {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID tidak valid" });
    }

    const body = req.body || {};
    const files = req.files || []; 


    const title = body.title?.trim() || undefined;
    const description = body.description?.trim() || undefined;
    const stock = body.stock != null && body.stock !== "" ? Number(body.stock) : undefined;
    const base_price = body.base_price != null && body.base_price !== "" ? Number(body.base_price) : undefined;

    let categoryIds, sizeIds, variantIds;
    try {
      categoryIds = body.categoryIds ? JSON.parse(body.categoryIds) : undefined;
      sizeIds = body.sizeIds ? JSON.parse(body.sizeIds) : undefined;
      variantIds = body.variantIds ? JSON.parse(body.variantIds) : undefined;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "categoryIds, sizeIds, variantIds harus dalam format JSON array",
      });
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
      categoryIds === undefined &&
      sizeIds === undefined &&
      variantIds === undefined &&
      files.length === 0
    ) {
      return res.status(400).json({ 
        success: false, 
        message: "Tidak ada data untuk diupdate" });
    }

    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Product tidak ditemukan" });
    }

    const updatedProduct = await updateProduct(productId, {
      title,
      description,
      stock,
      base_price,
      categoryIds,
      sizeIds,
      variantIds,
      files,
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
        message: "Gagal Update", error: err.message });
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
