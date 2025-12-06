import { createPagination } from "../libs/pagination.js";
import prisma from "../libs/prisma.js";
import { addToCartModel, createTransaction, deleteCartItem, deleteTransactionModel, getAllTransactionsModel, getCartItems, getTransactionByIdModel, getTransactionDetailModel, getTransactionHistoryModel, updateTransactionStatusModel } from "../models/order.models.js";


/**
 * POST /cart
 * @summary Add items to cart
 * @description Add one or multiple items to user's cart. Requires authentication.
 * @tags Order
 * @security bearerAuth
 * @param {array<object>} request.body.required - Array of cart items - application/json
 * @return {object} 200 - success response
 * @return {object} 400 - bad request
 * @return {object} 500 - server error
 * @example request - Multiple items example
 * [
 *   {
 *     "productId": 1,
 *     "variantId": 2,
 *     "sizeId": 3,
 *     "quantity": 2
 *   },
 *   {
 *     "productId": 5,
 *     "variantId": 2,
 *     "sizeId": 1,
 *     "quantity": 1
 *   }
 * ]
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
 * POST /transactions
 * @summary Create transaction from cart
 * @tags Transaction
 * @security bearerAuth
 * @param {object} request.body.required - application/json
 * @return {object} 200 - success response
 * @example request - application/json
 * {
 *   "fullname": "nama",
 *   "email": "nama@mail.com",
 *   "address": "Jl. Contoh No. 123, Jakarta",
 *   "paymentMethodId": 1,
 *   "shippingId": 2
 * }
 */
export async function createTransactionController(req, res) {
  try {
    const userId = req.jwtPayload.id;

    const {
      phone,
      address,
      paymentMethodId,
      shippingId,
      fullname,
      email
    } = req.body || {};

    const transaction = await createTransaction(userId, { 
      phone, 
      address, 
      paymentMethodId, 
      shippingId,
      fullname,
      email
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });

  } catch (err) {
    console.error(err);

    let statusCode = 400;

    if (err.message === "User not found" || 
        err.message === "Shipping method not found" || 
        err.message === "Payment method not found") {
      statusCode = 404;
    }

    let message = "Failed to create transaction";

    if (err.message === "User not found") {
      message = "User not found";
    } else if (err.message === "Phone and address required") {
      message = "Phone and address must be filled";
    } else if (err.message === "Cart is empty") {
      message = "Cart is empty, cannot create transaction";
    } else if (err.message === "Shipping method not found") {
      message = "Shipping method not found";
    } else if (err.message === "Payment method not found") {
      message = "Payment method not found";
    }

    res.status(statusCode).json({
      success: false,
      message: message,
      error: err.message,
    });
  }
}


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

/**
 * GET /transactions
 * @summary Get all transactions (Admin)
 * @tags Transaction Admin
 * @security bearerAuth
 *
 * @param {number} page.query - Page number for pagination
 * @param {number} limit.query - Number of items per page
 * @param {string} search.query - Search by invoice number or user fullname
 *
 * @return {object} 200 - Transactions fetched successfully
 * @return {object} 401 - Unauthorized
 * @return {object} 500 - Failed to fetch transactions
 */
export async function getAllTransactions (req, res){
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const baseUrl = "/transactions";

    const { transactions, pagination } = await getAllTransactionsModel({
      page: Number(page),
      limit: Number(limit),
      baseUrl,
      search,
    });

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      pagination: pagination.pagination,
      links: pagination.links,
      data: transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message,
    });
  }
};

/**
 * GET /transactions/{id}
 * @summary Get transaction detail by ID (admin only)
 * @tags Transaction Admin
 * @security bearerAuth
 *
 * @param {number} id.path - Transaction ID
 *
 * @return {object} 200 - Transaction detail
 * @return {object} 404 - Transaction not found
 * @return {object} 500 - Failed to fetch transaction
 */
export async function getTransactionById (req, res) {
  try {
    const { id } = req.params;

    const transaction = await getTransactionByIdModel(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
      error: err.message,
    });
  }
};

/**
 * PATCH /transactions/{id}/status
 * @summary Update transaction status
 * @tags Transaction Admin
 * @security bearerAuth
 * @param {number} id.path.required - Transaction ID
 * @param {number} statusId.form.required - Status ID
 * @consumes application/x-www-form-urlencoded
 * @return {object} 200 - success response
 * @return {object} 400 - bad request
 * @return {object} 404 - transaction not found
 * @return {object} 500 - server error
 */
export async function updateTransactionStatus(req, res) {
  try {
    const { id } = req.params;
    const { statusId } = req.body;

    if (!statusId) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const statusRecord = await prisma.status.findUnique({
      where: { id: Number(statusId) },
    });

    if (!statusRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid statusId",
      });
    }

    const result = await updateTransactionStatusModel(id, statusRecord.name);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction status updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update transaction status",
      error: err.message,
    });
  }
}

/**
 * DELETE /transactions/{id}
 * @summary Delete a transaction (admin only)
 * @tags Transaction Admin
 * @security bearerAuth
 *
 * @param {number} id.path - Transaction ID
 *
 * @return {object} 200 - Transaction deleted successfully
 * @return {object} 404 - Transaction not found
 * @return {object} 500 - Failed to delete transaction
 */
export async function deleteTransaction (req, res) {
  try {
    const { id } = req.params;

    const result = await deleteTransactionModel(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: err.message,
    });
  }
};
