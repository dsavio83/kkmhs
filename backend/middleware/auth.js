const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid.' });
    }

    req.user = user;
    return await next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token is not valid.' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

const teacherAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'TEACHER' || req.user.role === 'ADMIN')) {
    return next();
  } else {
    res.status(403).json({ message: 'Access denied. Teacher privileges required.' });
  }
};

const studentAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'STUDENT' || req.user.role === 'ADMIN')) {
    return next();
  } else {
    res.status(403).json({ message: 'Access denied. Student privileges required.' });
  }
};

module.exports = { auth, adminAuth, teacherAuth, studentAuth };