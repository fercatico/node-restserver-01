const { Router } = require("express");
const { check } = require("express-validator");
const {
  createProduct,
  productsGet,
  productGet,
  productPut,
  productDelete,
} = require("../controllers/products");
const { isValidProductId } = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdmin } = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/products
 */

router.get("/", productsGet);

router.get(
  "/:id",
  [
    check("id", "Is not a valida Mongo ID").isMongoId(),
    check("id").custom(isValidProductId),
    validateFields,
  ],
  productGet
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "Name cannot be empty.").not().isEmpty(),
    check("category", "Is not a valid Mongo ID").isMongoId(),
    validateFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Is not a valid Mongo ID").isMongoId(),
    check("id").custom(isValidProductId),
    validateFields,
  ],
  productPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", "Is not a valid Mongo ID").isMongoId(),
    check("id").custom(isValidProductId),
    validateFields,
  ],
  productDelete
);

module.exports = router;
