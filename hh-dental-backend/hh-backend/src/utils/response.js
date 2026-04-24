/**
 * Send a success response.
 */
const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

/**
 * Send an error response.
 */
const sendError = (res, message = "Something went wrong", statusCode = 500, extra = {}) => {
  return res.status(statusCode).json({ success: false, message, ...extra });
};

/**
 * Send a paginated response.
 */
const sendPaginated = (res, data, total, page, limit, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
