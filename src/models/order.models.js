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