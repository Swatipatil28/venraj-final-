const { PAGINATION } = require("../config/constants");

/**
 * Parse and validate pagination query params.
 */
const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build a mongoose sort object from query string.
 * e.g. ?sort=createdAt:desc,name:asc
 */
const parseSort = (sortQuery, defaultSort = { createdAt: -1 }) => {
  if (!sortQuery) return defaultSort;
  const sort = {};
  sortQuery.split(",").forEach((part) => {
    const [field, order] = part.split(":");
    if (field) sort[field.trim()] = order === "asc" ? 1 : -1;
  });
  return Object.keys(sort).length ? sort : defaultSort;
};

module.exports = { parsePagination, parseSort };
