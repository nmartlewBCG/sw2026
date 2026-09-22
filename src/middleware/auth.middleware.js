const userModel = require('../models/user.model');
const authService = require('../services/auth.service');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Authentication required. Send Authorization: Bearer <token>'
    });
  }

  try {
    const payload = authService.verifyToken(token);
    const user = userModel.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = { id: user.id, name: user.name, email: user.email };
    return next();
  } catch (error) {
    return res.status(error.status || 401).json({ error: error.message });
  }
}

module.exports = {
  authenticate
};
