exports.paginatedResults = async (model, query, req, options = {}) => {
  const {
    page = parseInt(req.query.page) || 1,
    limit = parseInt(req.query.limit) || 10,
    sortField = req.query.sort || 'createdAt',
    sortOrder = req.query.order === 'desc' ? -1 : 1,
    populateFields = [],
  } = options;

  const startIndex = (page - 1) * limit;

  let dbQuery = model.find(query).sort({ [sortField]: sortOrder }).limit(limit).skip(startIndex); //Add populate before search

  if (populateFields.length > 0) {
    populateFields.forEach((field) => {
      if (typeof field === 'string') {
        dbQuery = dbQuery.populate(field);
      } else if (typeof field === 'object') {
        dbQuery = dbQuery.populate(field);
      }
    });
  }

  const [results, totalCount] = await Promise.all([
    dbQuery.exec(),
    model.countDocuments(query),
  ]);

  const response = {
    results,
    totalCount,
    page,
    limit,
  };

  if (startIndex > 0) {
    response.previous = { page: page - 1, limit };
  }
  if (startIndex + limit < totalCount) {
    response.next = { page: page + 1, limit };
  }

  return response;
};