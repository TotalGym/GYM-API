const validation = (schema) => {
  return async (req, res, next) => {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    try {
      if (schema.body) {
        await schema.body.validate(data.body, { abortEarly: false });
      }

      if (schema.params) {
        await schema.params.validate(data.params, { abortEarly: false });
      }

      if (schema.query) {
        await schema.query.validate(data.query, { abortEarly: false });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
};

module.exports = validation;
