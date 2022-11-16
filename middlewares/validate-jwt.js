const { response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({ msg: "Token missing." });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    // check the user that is trying to delete the user
    const user = await User.findById(uid);
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Token invalid - user does not exists" });
    }
    // check if uid has status true
    if (!user.state) {
      return res
        .status(401)
        .json({ msg: "Token invalid - user with status false" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(token);
    res.status(401).json({ msg: "Token invalid." });
  }
};

module.exports = {
  validateJWT,
};
