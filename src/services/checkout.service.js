const productModel = require('../models/product.model');

const ALLOWED_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout({ items, paymentMethod }) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('items must be a non-empty array');
    error.status = 400;
    throw error;
  }

  if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    const error = new Error('paymentMethod must be cash or credit_card');
    error.status = 400;
    throw error;
  }

  const lineItems = items.map((item, index) => {
    if (!item || item.productId == null || item.quantity == null) {
      const error = new Error(`items[${index}] requires productId and quantity`);
      error.status = 400;
      throw error;
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      const error = new Error(`items[${index}].quantity must be a positive integer`);
      error.status = 400;
      throw error;
    }

    const product = productModel.findById(item.productId);
    if (!product) {
      const error = new Error(`Product ${item.productId} was not found`);
      error.status = 404;
      throw error;
    }

    const lineTotal = product.price * quantity;
    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = paymentMethod === 'cash' ? Number((subtotal * CASH_DISCOUNT_RATE).toFixed(2)) : 0;
  const total = Number((subtotal - discount).toFixed(2));

  return {
    items: lineItems,
    paymentMethod,
    subtotal,
    discount,
    discountRate: paymentMethod === 'cash' ? CASH_DISCOUNT_RATE : 0,
    total
  };
}

module.exports = {
  checkout
};
