import { createPagination } from "../libs/pagination.js";
import prisma from "../libs/prisma.js";


export async function addToCartModel(userId, items) {
  const addedItems = [];

  for (const item of items) {
    const { productId, variantId = null, sizeId = null, quantity = 1 } = item;

    if (quantity < 1) {
      throw new Error(`Quantity must be at least 1`);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { 
        id: true, 
        title: true,
        base_price: true, 
        stock: true,  
        images: { take: 1, select: { image: true } } 
      },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not available`);
    }

    if (product.stock === null || product.stock === undefined) {
      throw new Error(`Product "${product.title}" does not have stock information`);
    }

    if (product.stock <= 0) {
      throw new Error(`Product "${product.title}" is out of stock`);
    }

    if (quantity > product.stock) {
      throw new Error(
        `Product "${product.title}" only has ${product.stock} item(s) in stock, but you requested ${quantity}`
      );
    }

    let variant = null;
    if (variantId) {
      variant = await prisma.variant.findUnique({
        where: { id: variantId },
        select: { id: true, name: true, additional_price: true },
      });
      if (!variant) {
        throw new Error(`Variant with ID ${variantId} not available`);
      }
    }

    let size = null;
    if (sizeId) {
      size = await prisma.size.findUnique({
        where: { id: sizeId },
        select: { id: true, name: true, additional_price: true },
      });
      if (!size) {
        throw new Error(`Size with ID ${sizeId} not available`);
      }
    }

    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
        variantId,
        sizeId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        throw new Error(
          `Cannot add ${quantity} more of "${product.title}". You already have ${existingCartItem.quantity} in cart. Maximum stock is ${product.stock}`
        );
      }

      cartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: { 
              title: true, 
              base_price: true, 
              stock: true,
              images: { take: 1, select: { image: true } } 
            },
          },
          variant: { select: { name: true, additional_price: true } },
          size: { select: { name: true, additional_price: true } },
        },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          variantId,
          sizeId,
          quantity,
        },
        include: {
          product: {
            select: { 
              title: true, 
              base_price: true, 
              stock: true,
              images: { take: 1, select: { image: true } } 
            },
          },
          variant: { select: { name: true, additional_price: true } },
          size: { select: { name: true, additional_price: true } },
        },
      });
    }

    const subtotal =
      cartItem.quantity *
      (cartItem.product.base_price +
        (cartItem.variant?.additional_price || 0) +
        (cartItem.size?.additional_price || 0));

    addedItems.push({
      id: cartItem.id,
      productId: cartItem.productId,
      title: cartItem.product.title,
      basePrice: cartItem.product.base_price,
      image: cartItem.product.images?.[0]?.image || null,
      variant: cartItem.variant?.name || null,
      size: cartItem.size?.name || null,
      quantity: cartItem.quantity,
      availableStock: cartItem.product.stock,
      subtotal,
    });
  }

  return addedItems;
}


export async function getCartItems(userId) {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      product: {
        select: { title: true, base_price: true, images: { take: 1, select: { image: true } } },
      },
      variant: { select: { name: true, additional_price: true } },
      size: { select: { name: true, additional_price: true } },
    },
  });

  return cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    title: item.product.title,
    basePrice: item.product.base_price,
    image: item.product.images?.[0]?.image || null,
    variant: item.variant?.name || null,
    size: item.size?.name || null,
    quantity: item.quantity,
    subtotal:
      item.quantity *
      (item.product.base_price +
        (item.variant?.additional_price || 0) +
        (item.size?.additional_price || 0)),
  }));
}

export async function deleteCartItem(userId, cartId) {
  const cart = await prisma.cart.findFirst({
    where: { id: cartId, userId },
  });

  if (!cart) {
    return null; 
  }

  await prisma.cart.delete({ where: { id: cartId } });
  return true;
}

export async function createTransaction(
  userId,
  { phone, address, paymentMethodId, shippingId, fullname, email }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      carts: {
        include: {
          product: true,
          variant: true,
          size: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const userFullname = fullname?.trim() !== "" ? fullname : (user.fullname || user.profile?.fullname);
  const userEmail = email?.trim() !== "" ? email : (user.email || user.profile?.email);
  const userPhone = phone?.trim() !== "" ? phone : user.profile?.phone;
  const userAddress = address?.trim() !== "" ? address : user.profile?.address;

  if (!userFullname || !userEmail || !userPhone || !userAddress) {
    throw new Error("Fullname, email, phone, and address are required (body or profile)");
  }


  const cartItems = user.carts;

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalItemsPrice = cartItems.reduce((sum, item) => {
    const basePrice = item.product.base_price || 0;
    const variantPrice = item.variant?.additional_price || 0;
    const sizePrice = item.size?.additional_price || 0;

    const itemTotal = (basePrice + variantPrice + sizePrice) * item.quantity;
    return sum + itemTotal;
  }, 0);

  const shipping = await prisma.shipping.findUnique({
    where: { id: shippingId },
  });

  if (!shipping) {
    throw new Error("Shipping method not found");
  }

  const shippingFee = shipping.additional_price || 0;

  const subtotal = totalItemsPrice + shippingFee;

  const taxRate = 0.1;
  const taxAmount = subtotal * taxRate;

  const total = subtotal + taxAmount;

  const invoiceNumber = `INV-${new Date()
    .toISOString()
    .replace(/\D/g, "")
    .slice(0, 14)}-${userId}`;

  const paymentMethod = await prisma.paymentMethod.findUnique({
    where: { id: paymentMethodId },
  });

  if (!paymentMethod) {
    throw new Error("Payment method not found");
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      fullname: userFullname,
      email: userEmail,
      phone: userPhone,
      address: userAddress,
      paymentMethodId,
      shippingId,
      invoice_number: invoiceNumber,
      total,
      status: "OnProgress",
      items: {
        create: cartItems.map((item) => {
          const basePrice = item.product.base_price || 0;
          const variantPrice = item.variant?.additional_price || 0;
          const sizePrice = item.size?.additional_price || 0;

          return {
            productId: item.productId,
            variantId: item.variantId,
            sizeId: item.sizeId,
            quantity: item.quantity,
            subtotal: (basePrice + variantPrice + sizePrice) * item.quantity,
          };
        }),
      },
    },
    include: {
      items: {
        include: {
          product: { select: { title: true, base_price: true } },
          variant: { select: { name: true, additional_price: true } },
          size: { select: { name: true, additional_price: true } },
        },
      },
      paymentMethod: true,
      shipping: true,
    },
  });

  for (const item of cartItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  await prisma.cart.deleteMany({ where: { userId } });

  return {
    id: transaction.id,
    userId: transaction.userId,
    fullname: transaction.fullname,
    email: transaction.email,
    phone: transaction.phone,
    address: transaction.address,
    paymentMethodId: transaction.paymentMethodId,
    paymentMethodName: transaction.paymentMethod.name,
    shippingId: transaction.shippingId,
    shippingName: transaction.shipping.name,
    shippingFee: shippingFee,
    invoiceNumber: transaction.invoice_number,

    itemsTotal: totalItemsPrice,
    shippingTotal: shippingFee,
    subtotal: subtotal,
    taxRate: `${taxRate * 100}%`,
    taxAmount: taxAmount,
    total: transaction.total,

    status: transaction.status,
    createdAt: transaction.created_at,
    updatedAt: transaction.updated_at,

    items: transaction.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.product.title,
      basePrice: i.product.base_price,
      quantity: i.quantity,
      variantId: i.variantId,
      variantName: i.variant?.name || null,
      variantPrice: i.variant?.additional_price || 0,
      sizeId: i.sizeId,
      sizeName: i.size?.name || null,
      sizePrice: i.size?.additional_price || 0,
      subtotal: i.subtotal,
    })),
  };
}




export async function getTransactionHistoryModel({ userId, page, limit }) {
  const skip = (page - 1) * limit;

  const totalItems = await prisma.transaction.count({ where: { userId } });

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
    include: {
      items: {
        include: {
          product: { select: { images: { take: 1, select: { image: true } } } },
        },
      },
      shipping: true,
    },
  });

  const formatted = transactions.map((t) => {
    const firstImage = t.items[0]?.product.images?.[0]?.image || null;

    const itemsTotal = t.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const shippingFee = t.shipping?.additional_price || 0;

    const taxRate = 0.10;
    const subtotal = itemsTotal + shippingFee;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return {
      id: t.id,
      invoiceNumber: t.invoice_number,
      image: firstImage,

      itemsTotal,
      shippingFee,
      subtotal,
      taxRate: `${taxRate * 100}%`,
      taxAmount,
      total,

      status: t.status,
      createdAt: t.created_at,
      shippingName: t.shipping?.name || null,
    };
  });

  return { transactions: formatted, totalItems };
}


export async function getTransactionDetailModel({ transactionId, userId }) {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: Number(transactionId),
      userId,
    },
    include: {
      items: {
        include: {
          product: { select: { title: true, base_price: true, images: { take: 1, select: { image: true } } } },
          variant: { select: { name: true } },
        },
      },
      paymentMethod: { select: { name: true } },
      shipping: { select: { name: true, additional_price: true } },
    },
  });

  if (!transaction) return null;

  return {
    id: transaction.id,
    invoice: transaction.invoice_number,
    custName: transaction.fullname,
    custPhone: transaction.phone,
    custEmail: transaction.email,
    custAddress: transaction.address,
    paymentMethod: transaction.paymentMethod?.name || null,
    deliveryMethod: transaction.shipping?.name || null,
    status: transaction.status,
    total: transaction.total,
    createdAt: transaction.created_at,
    shippingPrice: transaction.shipping?.additional_price || 0,
    items: transaction.items.map((i) => ({
      id: i.id,
      name: i.product.title,
      image: i.product.images?.[0]?.image || null,
      basePrice: i.product.base_price,
      discountPrice: 0,
      variant: i.variant?.name || null,
      quantity: i.quantity,
      subtotal: i.subtotal,
    })),
  };
}

export async function getAllTransactionsModel({ page = 1, limit = 10, baseUrl, search = "" }) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { invoice_number: { contains: search, mode: "insensitive" } },
          { user: { fullname: { contains: search, mode: "insensitive" } } },
        ],
      }
    : {};

  const totalItems = await prisma.transaction.count({ where });

  const transactions = await prisma.transaction.findMany({
    where,
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: { select: { title: true, images: { take: 1, select: { image: true } } } },
          variant: { select: { name: true } },
          size: { select: { name: true } },
        },
      },
      paymentMethod: true,
      shipping: true,
    },
  });

  const formatted = transactions.map((t) => ({
    id: t.id,
    noOrders: t.invoice_number,
    createdAt: t.created_at,
    statusName: t.status,
    total: t.total,
    userFullname: t.user.fullname,
    userAddress: t.address,
    userPhone: t.phone,
    paymentMethod: t.paymentMethod?.name || null,
    shippingName: t.shipping?.name || null,
    orderItems: t.items.map((i) => ({
      title: i.product.title,
      qty: i.quantity,
      image: i.product.images?.[0]?.image || null,
      variant: i.variant?.name || null,
      size: i.size?.name || null,
    })),
  }));

  const pagination = createPagination({ totalItems, page, limit, baseUrl });

  return { transactions: formatted, pagination };
}

export async function getTransactionByIdModel(id) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
      items: {
        include: {
          product: { select: { title: true, images: { take: 1, select: { image: true } } } },
          variant: { select: { name: true } },
          size: { select: { name: true } },
        },
      },
      paymentMethod: true,
      shipping: true,
    },
  });

  if (!transaction) return null;

  return {
    id: transaction.id,
    noOrders: transaction.invoice_number,
    createdAt: transaction.created_at,
    statusName: transaction.status,
    total: transaction.total,
    userFullname: transaction.user.fullname,
    userAddress: transaction.address,
    userPhone: transaction.phone,
    paymentMethod: transaction.paymentMethod?.name || null,
    shippingName: transaction.shipping?.name || null,
    orderItems: transaction.items.map((i) => ({
      title: i.product.title,
      qty: i.quantity,
      size: i.size?.name || null,
      image: i.product.images?.[0]?.image || null,
      variant: i.variant?.name || null,
    })),
  };
}

export async function updateTransactionStatusModel(transactionId, newStatus) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(transactionId) },
  });

  if (!transaction) return null;

  const updated = await prisma.transaction.update({
    where: { id: Number(transactionId) },
    data: { status: newStatus },
  });

  return {
    code: 200,
    newStatus: updated.status,
    transactionId: updated.id,
  };
}

export async function deleteTransactionModel(transactionId) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(transactionId) },
  });

  if (!transaction) return null;

  await prisma.transaction.delete({
    where: { id: Number(transactionId) },
  });

  return { transactionId: Number(transactionId) };
}