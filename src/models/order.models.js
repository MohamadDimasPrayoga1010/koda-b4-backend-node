import prisma from "../libs/prisma.js";

export async function addToCartModel(userId, items) {
  const addedItems = [];

  for (const item of items) {
    const { productId, variantId = null, sizeId = null, quantity = 1 } = item;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, base_price: true, title: true, images: { take: 1, select: { image: true } } },
    });

    if (!product) throw new Error(`Product with ID ${productId} not available`);

    let variant = null;
    if (variantId) {
      variant = await prisma.variant.findUnique({
        where: { id: variantId },
        select: { id: true, name: true, additional_price: true },
      });
      if (!variant) throw new Error(`Variant with ID ${variantId} not available`);
    }

    let size = null;
    if (sizeId) {
      size = await prisma.size.findUnique({
        where: { id: sizeId },
        select: { id: true, name: true, additional_price: true },
      });
      if (!size) throw new Error(`Size with ID ${sizeId} not available`);
    }

    const cartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        variantId,
        sizeId,
        quantity,
      },
      include: {
        product: {
          select: { title: true, base_price: true, images: { take: 1, select: { image: true } } },
        },
        variant: { select: { name: true, additional_price: true } },
        size: { select: { name: true, additional_price: true } },
      },
    });

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

export async function createTransaction(userId, { phone, address, paymentMethodId, shippingId, fullname, email }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      carts: { include: { product: true, variant: true } },
    },
  });

  if (!user) throw new Error("User not found");

  const userFullname = fullname || user.fullname;
  const userEmail = email || user.email;
  const userPhone = user.profile?.phone || phone;
  const userAddress = user.profile?.address || address;

  if (!userPhone || !userAddress) throw new Error("Phone and address required");

  const cartItems = user.carts;
  const totalItemsPrice = cartItems.reduce((sum, item) => {
    const basePrice = item.product.base_price;
    const variantPrice = item.variant?.additional_price || 0;
    return sum + (basePrice + variantPrice) * item.quantity;
  }, 0);

  const shipping = await prisma.shipping.findUnique({ where: { id: shippingId } });
  const shippingFee = shipping?.additional_price || 0;

  const total = totalItemsPrice + shippingFee;

  const invoiceNumber = `INV-${new Date().toISOString().replace(/\D/g,'').slice(0,14)}-${userId}`;

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
      status: "OnProgres",
      items: {
        create: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          subtotal: (item.product.base_price + (item.variant?.additional_price || 0)) * item.quantity
        }))
      }
    },
    include: {
      items: {
        include: {
          product: { select: { title: true } },
          variant: { select: { name: true } }
        }
      },
      paymentMethod: true,
      shipping: true
    }
  });

  await prisma.cart.deleteMany({ where: { userId } });

  return {
    id: transaction.id,
    userId: transaction.userId,
    fullname: transaction.fullname,
    email: transaction.email,
    phone: transaction.phone,
    address: transaction.address,
    paymentMethodName: transaction.paymentMethod.name,
    shippingName: transaction.shipping.name,
    invoiceNumber: transaction.invoice_number,
    total: transaction.total,
    status: transaction.status,
    createdAt: transaction.created_at,
    updatedAt: transaction.updated_at,
    items: transaction.items.map(i => ({
      id: i.id,
      productId: i.productId,
      productName: i.product.title,
      quantity: i.quantity,
      variantId: i.variantId,
      variantName: i.variant?.name || null,
      subtotal: i.subtotal
    }))
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
    const total = itemsTotal + shippingFee;

    return {
      id: t.id,
      invoiceNumber: t.invoice_number,
      image: firstImage,
      total,
      status: t.status,
      createdAt: t.created_at,
      shippingName: t.shipping?.name || null,
      shippingFee,
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