export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const rawLimit = parseInt(query.limit || '10', 10) || 10;
  const limit = Math.min(100, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
