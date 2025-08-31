// middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // e.g., "Bearer token"
    if (!authHeader) return res.status(401).json({ message: "Not authenticated!" });

    const token = authHeader.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ message: "Token missing!" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      _id: decoded.id || decoded._id,
      isAdmin: decoded.isAdmin || false,
      ...decoded,
    };

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ message: "Token is invalid!" });
  }
};

// Middleware to allow only Admins
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated!" });

    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "You are not allowed!" });
    }
  });
};
