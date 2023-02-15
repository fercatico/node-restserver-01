const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  categoriesGet,
  catetoryGet,
  categoryPut,
  categoryDelete,
} = require("../controllers/categories");
const { isValidCategoryId } = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdmin } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/categories
 */

//get all categories - public
router.get("/", categoriesGet);

//get category by id - public
router.get(
  "/:id",
  [
    check("id", "Is not a valida Mongo ID").isMongoId(),
    check("id").custom(isValidCategoryId),
    validateFields,
  ],
  catetoryGet
);

//create category - private - anyone with a valid token
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name cannot be empty.").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

//update - private - anyone with a valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Name is required.").not().isEmpty(),
    check("id").custom(isValidCategoryId),
    validateFields,
  ],
  categoryPut
);

//delete - private - anyone with a valid token
router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", "Is not a valida Mongo ID").isMongoId(),
    check("id").custom(isValidCategoryId),
    validateFields,
  ],
  categoryDelete
);

module.exports = router;
