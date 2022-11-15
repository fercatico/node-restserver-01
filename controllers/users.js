const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const usersGet = async (req, res = response) => {
  //const { query, nombre = "No name", apikey, page = "1" } = req.query;
  //url test http://localhost:8080/api/users?query=hola&apikey=123456789&page=22
  const { limit = 5, from = 0 } = req.query;
  const dbQuery = { state: true };

  //const users = await User.find(dbQuery).skip(from).limit(Number(limit));
  //const total = await User.countDocuments(dbQuery);
  const [total, users] = await Promise.all([
    User.countDocuments(dbQuery),
    User.find(dbQuery).skip(from).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const usersPost = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  //Verify if email exists
  /*const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(400).json({ msg: "Email already exists" });
  }*/

  //Encrypt password
  const salt = bcryptjs.genSaltSync(); //10 is set as default param
  user.password = bcryptjs.hashSync(password, salt);

  //Save user
  await user.save();

  res.json({
    msg: "post API - controller",
    user,
  });
};

const usersPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  //Validate user
  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json({
    msg: "put API - controller",
    user,
  });
};

const usersPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controller",
  });
};

const usersDelete = async (req, res = response) => {
  const { id } = req.params;

  //delete it physically - Not recommended becuase it might affected relationships with other collections
  //const user = await User.findByIdAndDelete(id);

  //recommended is to change a state property to false if the user is no longer needed
  const user = await User.findByIdAndUpdate(id, {state:false});


  res.json({
    user,
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
