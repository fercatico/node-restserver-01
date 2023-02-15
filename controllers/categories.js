const { response } = require("express");
const { Category } = require("../models");

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      msg: `Category ${name} already exists.`,
    });
  }

  //Generate data to store
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  //Save on DB
  await category.save();

  res.status(201).json(category);
};

const categoriesGet = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const dbQuery = { state: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(dbQuery),
    Category.find(dbQuery)
      .populate("user", "name")
      .skip(from)
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  });
};

const catetoryGet = async (req, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", [
    "name",
    "role",
  ]);
  res.json(category);
};

const categoryPut = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  res.json(category);
};

const categoryDelete = async (req, res = response) => {
  const { id } = req.params;
  const categoryDeleted = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );
  res.json(categoryDeleted);
};

module.exports = {
  createCategory,
  categoriesGet,
  catetoryGet,
  categoryPut,
  categoryDelete,
};
