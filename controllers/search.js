const { response } = require("express");
const { User } = require("../models");
const { ObjectId } = require("mongoose").Types;

const allowCollections = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res = response) => {
  const isMongoId = ObjectId.isValid(term);
  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({ results: (user) ? [user] : [] });
  }
};

const search = (req, res = response) => {
  const { collection, term } = req.params;

  if (!allowCollections.includes(collection)) {
    return res.status(400).json({ msg: `This is not a valid collection` });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      break;
    case "products":
      break;
    case "roles":
      break;
    default:
      res.status(500).json({ msg: "No search is possible." });
  }

  //res.json({ msg: "Busca...." });
};

module.exports = {
  search,
};
