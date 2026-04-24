const AdminUser = require("../models/AdminUser");
const { generateToken } = require("../utils/jwt");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/admin/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({ email, isActive: true }).select("+password");
    if (!admin) {
      return sendError(res, "Invalid email or password.", 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, "Invalid email or password.", 401);
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id, admin.role);

    return sendSuccess(res, {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    }, "Login successful");
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/me
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, req.admin, "Admin profile retrieved");
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe };
