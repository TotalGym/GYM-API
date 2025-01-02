exports.paginatedResults = (model) => {
    return async (req, res, next) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const sortField = req.query.sort || 'createdAt';
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
  
      const startIndex = (page - 1) * limit;
  
      const results = {};
  
      try {
        const query = search
          ? { $text: { $search: search } }
          : {};
  
        results.results = await model
          .find(query)
          .sort({ [sortField]: sortOrder })
          .limit(limit)
          .skip(startIndex)
          .exec();
  
        const totalDocuments = await model.countDocuments(query);
        results.totalCount = totalDocuments;
  
        if (startIndex > 0) {
          results.previous = { page: page - 1, limit };
        }
        if (startIndex + limit < totalDocuments) {
          results.next = { page: page + 1, limit };
        }
  
        res.paginatedResults = results;
        next();
      } catch (e) {
        res.status(500).json({ message: "Error: " + e.message });
      }
    };
  };
  