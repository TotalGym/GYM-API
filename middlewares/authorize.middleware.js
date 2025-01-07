const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role;
  
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Access forbidden: You must be one of the following roles: ${allowedRoles.join(", ")}.`,
        });
      }
      next();
    };
  };
  
module.exports = authorizeRole;
  