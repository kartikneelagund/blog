import jwt from "jsonwebtoken";

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // e.g., "Bearer token"
    if (!authHeader) return res.status(401).json({ message: "Not authenticated!" });

    const token = authHeader.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ message: "Token missing!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

// Middleware for Admin-only routes
export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) next();
    else res.status(403).json({ message: "You are not allowed!" });
  });
};
