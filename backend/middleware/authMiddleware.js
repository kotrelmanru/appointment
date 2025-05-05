const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token = null;

  // ambil token dari header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // verifikasi signature & expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded => { id: 'ccd7eb83-24d5-46c2-a486-eddc3786116f', iat:…, exp:… }

    // temukan user berdasarkan UUID di field `id`
    const user = await User.findOne({ id: decoded.id }).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;    // simpan seluruh user doc (tanpa password) di req.user
    next();
  } catch (err) {
    console.error('JWT verification error:', err.name, err.message);
    const msg = err.name === 'TokenExpiredError' ? 'token expired' : 'token invalid';
    return res.status(401).json({ message: `Not authorized, ${msg}` });
  }
};
