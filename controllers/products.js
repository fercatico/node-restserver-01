const { response } = require("express");
const { Product } = require("../models");

const createProduct = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const productDB = await Product.findOne({ name });
  if (productDB) {
    return res.status(400).json({
      msg: `Product ${name} already exists.`,
    });
  }

  //Generate data to store
  const data = {
    name,
    user: req.user._id,
    category: req.body.category
  };

  const product = new Product(data);

  //Save on DB
  await product.save();

  res.status(201).json(product);
};

const productsGet = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const dbQuery = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(dbQuery),
    Product.find(dbQuery)
    .populate("user", "name")
    .populate("category", "name")
    .skip(from)
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  });
};

const productGet = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("user", [
    "name",
    "role",
  ]);
  res.json(product);
};

const productPut = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  res.json(product);
};

const productDelete = async (req, res = response) => {
  const { id } = req.params;
  const productDeleted = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );
  res.json(productDeleted);
};

module.exports = {
  createProduct,
  productsGet,
  productGet,
  productPut,
  productDelete,
};
