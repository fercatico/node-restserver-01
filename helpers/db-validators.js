const { Category, Product } = require("../models");
const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) {
    throw new Error(`Role ${role} is not valid.`);
  }
};

const emailExists = async (email = "") => {
  //Verify if email exists
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    throw new Error("Email already exists.");
  }
};

const isValidUserId = async (id) => {
  //Verify if email exists
  const idExists = await User.findById({ _id: id });
  if (!idExists) {
    throw new Error("Id is invalid.");
  }
};

/**
 * Category Model Validators
 * @param {*} id
 */
const isValidCategoryId = async (id) => {
  //Verify if email exists
  const idExists = await Category.findById({ _id: id });
  if (!idExists) {
    throw new Error("Category id is invalid.");
  }
};


/**
 * Product Model Validators
 * @param {*} id
 */
const isValidProductId = async (id) => {
  //Verify if email exists
  const idExists = await Product.findById({ _id: id });
  if (!idExists) {
    throw new Error("Product id is invalid.");
  }
};

module.exports = { isValidRole, emailExists, isValidUserId, isValidCategoryId, isValidProductId };
