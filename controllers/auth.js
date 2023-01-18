const { response, json } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { email, name, picture } = await googleVerify(id_token);
    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: "1234567",
        picture,
        google: true,
        role: "USER_ROLE",
      };

      user = new User(data);
      await user.save();
    }

    if (!user.state) {
      return res.status(401).json({
        msg: "User is blocked",
      });
    }

    //generate JWT
    const token = await generateJWT(user.id);
    res.json({ user, token });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = { login, googleSignIn };
