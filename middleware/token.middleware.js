const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN } = process.env;

//TODO: refresh token
const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const isTokenValid = (token) => jwt.verify(token, JWT_SECRET);

const sendCreateToken = (user, statusCode, req, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: req.secure || req.headers('x-forwarded-proto') === 'https',
  };

  res.cookie('jwt', token, { ...cookieOptions });
  req.user = user;

  res.status(statusCode).json({
    status: 'success',
    token,
  });
};

module.exports = {
  createToken,
  sendCreateToken,
  isTokenValid,
};
