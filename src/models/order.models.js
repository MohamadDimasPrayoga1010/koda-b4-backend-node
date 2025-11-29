import prisma from "../libs/prisma.js";

export async function addToCartModel(userId, items) {
   const addedItems = [];

  for (const item of items) {
    const { productId, variantId = null, sizeId = null, quantity = 1 } = item;

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
        variant: { select: { name: true } },
        size: { select: { name: true } },
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

export async function createTransaction(userId, { phone, address, paymentMethodId, shippingId }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      carts: {
        include: { product: true, variant: true, size: true },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const fullname = user.fullname;
  const email = user.email;
  const userPhone = user.profile?.phone || phone;
  const userAddress = user.profile?.address || address;

  if (!userPhone || !userAddress) throw new Error("Phone and address required");

  const cartItems = user.carts;

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const total = cartItems.reduce((sum, item) => {
    const basePrice = item.product.base_price;
    const variantPrice = item.variant?.additional_price || 0;
    return sum + (basePrice + variantPrice) * item.quantity;
  }, 0);

  const invoiceNumber = `INV-${new Date().toISOString().replace(/\D/g,'').slice(0,14)}-${userId}`;

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      fullname,
      email,
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
          sizeId: item.sizeId,
          quantity: item.quantity,
          subtotal: (item.product.base_price + (item.variant?.additional_price || 0)) * item.quantity,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: { select: { title: true } },
          variant: { select: { name: true } },
          size: { select: { name: true } },
        },
      },
      paymentMethod: true,
      shipping: true,
    },
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
      sizeName: i.size?.name || null,
      subtotal: i.subtotal,
    })),
  };
}

