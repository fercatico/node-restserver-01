const { response } = require("express");

const isAdmin = (req, res = response, next) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ msg: "Checking role before validating token first" });
  }

  const { role, name } = req.user;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not an Admin User.`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res
        .status(500)
        .json({ msg: "Checking role before validating token first" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({
          msg: `The action requireds one of the following roles ${roles}`,
        });
    }
    next();
  };
};

module.exports = { isAdmin, hasRole };
