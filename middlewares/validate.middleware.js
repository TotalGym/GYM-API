const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
};

module.exports = validate;