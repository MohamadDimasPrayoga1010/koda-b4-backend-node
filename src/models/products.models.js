import prisma from "../libs/prisma.js";

export async function createProduct(data, files) {
  const { title, description, base_price, stock, categoryIds, sizeIds, variantIds } = data;

  const categories = categoryIds ? JSON.parse(categoryIds) : [];
  const sizes = sizeIds ? JSON.parse(sizeIds) : [];
  const variants = variantIds ? JSON.parse(variantIds) : [];

  const imageData = files ? files.map(file => ({ image: file.path })) : [];

  const product = await prisma.product.create({
    data: {
      title,
      description,
      base_price: Number(base_price),
      stock: stock ? Number(stock) : 0,
      categories: { create: categories.map(id => ({ category: { connect: { id } } })) },
      sizes: { create: sizes.map(id => ({ size: { connect: { id } } })) },
      variants: { create: variants.map(id => ({ variant: { connect: { id } } })) },
      images: { create: imageData },
    },
    include: {
      categories: { include: { category: true } },
      sizes: { include: { size: true } },
      variants: { include: { variant: true } },
      images: true,
    },
  });

  return product;
}


export async function uploadProductImage(productId, filename){
    return await prisma.productImage.create({
        data:{
            productId,
            image: filename
        }
    })
}

export async function getAllProducts({ search, page = 1, limit = 10, sort }) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        title: {
          contains: search.toLowerCase(),
        },
      }
    : {};

  let orderBy = { created_at: "desc" };

  if (sort === "termurah") {
    orderBy = { base_price: "asc" }; 
  } else if (sort === "termahal") {
    orderBy = { base_price: "desc" }; 
  }

  const totalItems = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    skip,
    take: Number(limit),
    orderBy,
    include: {
      images: true,
      categories: { include: { category: true } },
      sizes: { include: { size: true } },
      variants: { include: { variant: true } },
    },
  });

  return { products, totalItems };
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
  if (data.stock !== undefined) updateData.stock = Number(data.stock);
  if (data.base_price !== undefined) updateData.base_price = Number(data.base_price);

  if (Array.isArray(data.categoryIds)) {
    updateData.categories = {
      deleteMany: {},
      create: data.categoryIds.map(catId => ({ category: { connect: { id: Number(catId) } } })),
    };
  }

  if (Array.isArray(data.sizeIds)) {
    updateData.sizes = {
      deleteMany: {},
      create: data.sizeIds.map(sizeId => ({ size: { connect: { id: Number(sizeId) } } })),
    };
  }

  if (Array.isArray(data.variantIds)) {
    updateData.variants = {
      deleteMany: {},
      create: data.variantIds.map(variantId => ({ variant: { connect: { id: Number(variantId) } } })),
    };
  }

  if (Array.isArray(data.files) && data.files.length > 0) {
    const imageData = data.files.map(file => ({ image: file.path }));
    updateData.images = {
      create: imageData,
    };
  }

  return await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      categories: { include: { category: true } },
      sizes: { include: { size: true } },
      variants: { include: { variant: true } },
      images: true,
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

