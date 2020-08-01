const jwt = require('jsonwebtoken')
const keys = require('../config/keys');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    // Check for token
    if (!token)
      return res.status(401).json({ msg: 'No token, authorizaton denied' });
  
    try {
      // Verify token
      let t = token.split(' ')[1];
      const decoded = jwt.verify(t, keys.secretOrKey);
      // Add user from payload
      req.user = decoded;
      next();
    } catch (e) {
      res.status(400).json({ msg: 'Token is not valid' });
    }
  };