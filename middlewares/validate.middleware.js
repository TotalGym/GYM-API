const validate = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const errors = err.inner.map((e) => ({
        path: e.path,
        message: e.message,
      }));
      res.status(400).json({ errors });
    }
  };
  
  module.exports = validate;