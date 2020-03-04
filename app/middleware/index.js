const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const secret = "secret";

exports.withAuth = function (req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || authorization.split(' ')[0] !== 'Bearer') {
    res.status(401)
      .json({
        error: 'Unauthorized: Bearer token is not provided'
      })
  }
  const token = authorization.split(' ')[1]

  if (!token) {
    res.status(401)
      .json({
        error: 'Unauthorized: No token provided'
      })
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(401).json({
          error: 'Unauthorized: Invalid token'
        })
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}