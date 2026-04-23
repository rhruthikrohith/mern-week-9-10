import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // ✅ Check Authorization header first, then fall back to cookie
      let token = req.cookies.token;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please login" });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Forbidden. You don't have permission" });
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please login again" });
      }
    }
  };
};
