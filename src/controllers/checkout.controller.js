const checkoutService = require('../services/checkout.service');

function checkout(req, res, next) {
  try {
    const result = checkoutService.checkout({
      items: req.body?.items,
      paymentMethod: req.body?.paymentMethod
    });

    res.status(200).json({
      user: req.user,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkout
};
