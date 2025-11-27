import prisma from "../libs/prisma.js";

export async function createProduct(data) {
  return await prisma.product.create({
    data: {
      title: data.title,
      description: data.description,
      stock: data.stock,
      base_price: data.base_price,

      categories: {
        create: data.categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      },

      sizes: {
        create: data.sizeIds.map((sizeId) => ({
          size: { connect: { id: sizeId } },
        })),
      },

      variants: {
        create: data.variantIds.map((variantId) => ({
          variant: { connect: { id: variantId } },
        })),
      },
    },
    include: {
      categories: { include: { category: true } },
      sizes: { include: { size: true } },
      variants: { include: { variant: true } },
    },
  });
}


export async function uploadProductImage(productId, filename){
    return await prisma.productImage.create({
        data:{
            productId,
            image: filename
        }
    })
}

export async function getAllProducts() {
  return await prisma.product.findMany({
    include: {
      images: true,
      categories: {
        include: {
          category: true, 
        },
      },
      sizes: {
        include: {
          size: true, 
        },
      },
      variants: {
        include: {
          variant: true, 
        },
      },
    },
  });
}

export async function getProductById(id) {
  return await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      images: true,
      categories: {
        include: {
          category: true, 
        },
      },
      sizes: {
        include: {
          size: true, 
        },
      },
      variants: {
        include: {
          variant: true, 
        },
      },
    },
  });
}


export async function updateProduct(id, data) {
  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.base_price !== undefined) updateData.base_price = data.base_price;

  if (Array.isArray(data.categoryIds) && data.categoryIds.length > 0) {
    updateData.categories = {
      deleteMany: {},
      create: data.categoryIds.map((catId) => ({
        category: { connect: { id: catId } },
      })),
    };
  }

  if (Array.isArray(data.sizeIds) && data.sizeIds.length > 0) {
    updateData.sizes = {
      deleteMany: {},
      create: data.sizeIds.map((sizeId) => ({
        size: { connect: { id: sizeId } },
      })),
    };
  }

  if (Array.isArray(data.variantIds) && data.variantIds.length > 0) {
    updateData.variants = {
      deleteMany: {},
      create: data.variantIds.map((variantId) => ({
        variant: { connect: { id: variantId } },
      })),
    };
  }

  return await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      categories: { include: { category: true } },
      sizes: { include: { size: true } },
      variants: { include: { variant: true } },
    },
  });
}

export async function deleteProduct(id) {
  await prisma.productCategory.deleteMany({ where: { productId: id } });
  await prisma.productSize.deleteMany({ where: { productId: id } });
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.productImage.deleteMany({ where: { productId: id } });

  return await prisma.product.delete({
    where: { id },
  });
}

