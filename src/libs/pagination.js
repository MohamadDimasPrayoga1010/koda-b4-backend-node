export function createPagination({ totalItems, page, limit, baseUrl, sortBy }) {
  const totalPages = Math.ceil(totalItems / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const backPage = page > 1 ? page - 1 : null;

  const sortQuery = sortBy ? `&sort=${sortBy}` : "";

  return {
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
    links: {
      next: nextPage
        ? `${baseUrl}?limit=${limit}&page=${nextPage}${sortQuery}`
        : null,
      back: backPage
        ? `${baseUrl}?limit=${limit}&page=${backPage}${sortQuery}`
        : null,
    },
  };
}
