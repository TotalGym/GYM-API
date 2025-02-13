const { responseHandler } = require('../utils/responseHandler');

const validation = (schema) => {
  return async (req, res, next) => {
    try {
      const data = {
        body: req.body,
        params: req.params,
        query: req.query,
      };


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
      if (error instanceof require('yup').ValidationError) {
        return responseHandler(res, 400, false, "Validation failed", null, error.errors);
      }
      next(error); 
    }
  };
};

module.exports = validation;
