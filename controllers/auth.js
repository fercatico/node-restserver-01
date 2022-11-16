const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //validate if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User/Password invalid.",
      });
    }
    //validate if use is active
    if (user.state == false) {
      return res
        .status(400)
        .json({ msg: "User does not exists or status is false." });
    }

    //validate password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "User/Password invalid - password." });
    }

    //generate JWT
    const token = await generateJWT(user.id);

    res.json({ user, token });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error occured",
    });
  }
};

module.exports = { login };
