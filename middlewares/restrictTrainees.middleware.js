const { responseHandler } = require("../utils/responseHandler");

module.exports = (req, res, next) => {
    if (req.user && req.user.role === "Trainee") {
      return responseHandler(res, 403, false, "Access denied.");
    }
    next();
  };  