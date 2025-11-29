import { addToCartModel, deleteCartItem, getCartItems } from "../models/order.models.js";


/**
 * POST /cart
 * @summary Add items to cart
 * @tags Order
 * @security bearerAuth
 *
 * @param {array<object>} request.body.required - Array of cart items
 * @param {number} request.body[].productId.required - Product ID
 * @param {number} request.body[].variantId - Variant ID (optional)
 * @param {number} request.body[].sizeId - Size ID (optional)
 * @param {number} request.body[].quantity - Quantity (default 1)
 *
 * @return {object} 200 - Items added successfully
 * @return {object} 400 - Bad request
 * @return {object} 500 - Failed to add items
 */
export async function addToCart (req, res) {
  try {
    const { id: userId } = req.jwtPayload; 
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array of cart items",
      });
    }

    const addedItems = await addToCartModel(userId, items);

    res.status(200).json({
      success: true,
      message: "Items added successfully",
      data: addedItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to add items to cart",
      error: err.message,
    });
  }
};

/**
 * GET /cart
 * @summary Get all items in the user's cart
 * @tags Order
 * @security bearerAuth
 *
 * @return {object} 200 - Cart fetched successfully
 * @return {object} 500 - Failed to fetch cart items
 */
export async function getCart(req, res) {
    try {
    const { id: userId } = req.jwtPayload;

    const items = await getCartItems(userId);

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        items,
        total,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
      error: err.message,
    });
  }
}


/**
 * DELETE /cart/{id}
 * @summary Delete a cart item by ID
 * @tags Order
 * @security bearerAuth
 *
 * @param {number} id.path - Cart item ID
 *
 * @return {object} 200 - Cart item deleted successfully
 * @return {object} 400 - Invalid cart ID
 * @return {object} 404 - Cart item not found
 * @return {object} 500 - Failed to delete cart item
 */
export async function deleteCart (req, res) {
  try {
    const { id: userId } = req.jwtPayload;
    const cartId = Number(req.params.id);

    if (isNaN(cartId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart ID",
      });
    }

    const deleted = await deleteCartItem(userId, cartId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
      error: err.message,
    });
  }
};


