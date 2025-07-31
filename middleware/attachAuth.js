import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

const attachAuth = async (req, res, next) => {
  req.isAuthenticated = false; // default

  try {
    let token = req.header('Authorization');

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.userId);

      if (user) {
        req.userId = decoded.userId;
        req.isAuthenticated = true;
      }
    }
  } catch (err) {
    console.log('Auth middleware error (non-blocking):', err.message);
  }

  next();
};

export default attachAuth;
