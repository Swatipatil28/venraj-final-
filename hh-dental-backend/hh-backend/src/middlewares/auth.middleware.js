const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const { sendError } = require("../utils/response");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, "Access denied. No token provided.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await AdminUser.findById(decoded.id).select("-password");
    if (!admin || !admin.isActive) {
      return sendError(res, "Account not found or deactivated.", 401);
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return sendError(res, "Invalid token.", 401);
    }
    if (err.name === "TokenExpiredError") {
      return sendError(res, "Token expired. Please login again.", 401);
    }
    next(err);
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== "super_admin") {
    return sendError(res, "Super admin access required.", 403);
  }
  next();
};

module.exports = { protect, superAdminOnly };
