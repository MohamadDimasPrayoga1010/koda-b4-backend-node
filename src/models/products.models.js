import prisma from "../libs/prisma.js";

export async function createProduct(data, files) {
  const { title, description, base_price, stock } = data;

  const parseIds = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(Number).filter(n => !isNaN(n));
    if (typeof value === "string") {
      return value
        .split(",")
        .map(id => Number(id.trim()))
        .filter(n => !isNaN(n));
    }
    return [];
  };

  const categories = parseIds(data.categoryIds);
  const sizes = parseIds(data.sizeIds);
  const variants = parseIds(data.variantIds);

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

  const parseIds = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(Number).filter(n => !isNaN(n));
    if (typeof value === "string") {
      return value.split(",").map(v => Number(v.trim())).filter(n => !isNaN(n));
    }
    return [];
  };

  const categories = parseIds(data.categoryIds);
  const sizes = parseIds(data.sizeIds);
  const variants = parseIds(data.variantIds);

  if (categories.length > 0) {
    updateData.categories = {
      deleteMany: {},
      create: categories.map(catId => ({ category: { connect: { id: catId } } })),
    };
  }

  if (sizes.length > 0) {
    updateData.sizes = {
      deleteMany: {},
      create: sizes.map(sizeId => ({ size: { connect: { id: sizeId } } })),
    };
  }

  if (variants.length > 0) {
    updateData.variants = {
      deleteMany: {},
      create: variants.map(variantId => ({ variant: { connect: { id: variantId } } })),
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

export async function getFavoriteProducts() {
  return prisma.product.findMany({
    where: { is_favorite: true },
    select: {
      id: true,
      title: true,
      description: true,
      base_price: true,
      images: {
        take: 1,
        select: { image: true },
      },
    },
  });
}

export async function filterProductsModel({
  search,
  category,
  sort,
  page,
  limit,
  price_min,
  price_max,
}) {
  const skip = (page - 1) * limit;
  const AND = [];

  AND.push({ deleted_at: null });

  if (search && search.trim() !== "") {
    AND.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (category && !isNaN(Number(category))) {
    AND.push({
      categories: {
        some: {
          categoryId: Number(category),
        },
      },
    });
  }

  if (price_min || price_max) {
    const priceFilter = {};
    if (price_min) priceFilter.gte = Number(price_min);
    if (price_max) priceFilter.lte = Number(price_max);

    AND.push({ base_price: priceFilter });
  }

  const where = AND.length > 0 ? { AND } : {};

  const totalData = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: { base_price: sort === "desc" ? "desc" : "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      base_price: true,
      categories: {
        select: {
          categoryId: true,
          category: { select: { name: true } },
        },
      },
      images: {
        where: { deleted_at: null },
        take: 1,
        select: { image: true },
      },
    },
  });

  return {
    products,
    totalData,
    totalPages: Math.ceil(totalData / limit),
    currentPage: page,
    limit,
    where, 
  };
}


