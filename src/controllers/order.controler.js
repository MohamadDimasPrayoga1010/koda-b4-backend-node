import { createPagination } from "../libs/pagination.js";
import { addToCartModel, createTransaction, deleteCartItem, getCartItems, getTransactionDetailModel, getTransactionHistoryModel } from "../models/order.models.js";


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
export async function addToCart(req, res) {
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
      message: err.message.includes("not available")
        ? "Product not available"
        : "Failed to add items to cart",
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

    if (items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          items: [],
          total: 0,
        },
      });
    }

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

/**
 * POST /transaction
 * @summary Create a new transaction from cart
 * @tags Transaction
 * @security bearerAuth
 *
 * @param {object} request.body.required - Transaction info (phone & address optional if profile exists)
 * @param {string} request.body.phone - Phone number (required if profile empty)
 * @param {string} request.body.address - Address (required if profile empty)
 * @param {number} request.body.paymentMethodId.required - Payment method ID
 * @param {number} request.body.shippingId.required - Shipping ID
 *
 * @return {object} 200 - Transaction created successfully
 * @return {object} 400 - Phone and address required
 * @return {object} 500 - Failed to create transaction
 */
export const createTransactionController = async (req, res) => {
  try {
    const userId = req.jwtPayload.id;
    const { phone, address, paymentMethodId, shippingId } = req.body;

    const transaction = await createTransaction(userId, { phone, address, paymentMethodId, shippingId });

    res.status(200).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message:
        err.message === "Phone and address required"
          ? "Phone and address must be filled"
          : err.message === "Cart is empty"
          ? "Cart is empty, cannot create transaction"
          : "Failed to create transaction",
      error: err.message,
    });
  }
};

/**
 * GET /transactions/history
 * @summary Get user transaction history with pagination
 * @tags Transaction
 * @security bearerAuth
 *
 * @param {number} query.page - Page number (default: 1)
 * @param {number} query.limit - Number of items per page (default: 5)
 *
 * @return {object} 200 - Transaction history fetched successfully
 * @return {object} 500 - Failed to fetch transaction history
 */
export async function getTransactionHistoryController(req, res) {
  try {
    const userId = req.jwtPayload.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { transactions, totalItems } = await getTransactionHistoryModel({
      userId,
      page,
      limit,
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No transaction history found",
        pagination: createPagination({
          totalItems: 0,
          page,
          limit,
          baseUrl: "/transactions/history",
        }).pagination,
        links: createPagination({
          totalItems: 0,
          page,
          limit,
          baseUrl: "/transactions/history",
        }).links,
        data: [],
      });
    }

    const { pagination, links } = createPagination({
      totalItems,
      page,
      limit,
      baseUrl: "/transactions/history",
    });

    res.status(200).json({
      success: true,
      message: "History transactions fetched successfully",
      pagination,
      links,
      data: transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction history",
      error: err.message,
    });
  }
}

/**
 * GET /transactions/history/{id}
 * @summary Get transaction detail by ID
 * @tags Transaction
 * @security bearerAuth
 *
 * @param {number} id.path - Transaction ID
 *
 * @return {object} 200 - Transaction detail
 * @return {object} 404 - Transaction not found
 * @return {object} 500 - Failed to fetch transaction detail
 */
export const getTransactionDetail = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { id: userId } = req.jwtPayload;

    const transaction = await getTransactionDetailModel({ transactionId, userId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction detail fetched successfully",
      data: transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction detail",
      error: err.message,
    });
  }
};