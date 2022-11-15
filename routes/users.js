const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const {
  usersGet,
  usersPut,
  usersPost,
  usersPatch,
  usersDelete,
} = require("../controllers/users");
const {
  isValidRole,
  emailExists,
  isValidUserId,
} = require("../helpers/db-validators");
const router = Router();

router.get("/", usersGet);

router.post(
  "/",
  [
    check("name", "Name is required.").not().isEmpty(),
    check("password", "Password must be above 6 characters.").isLength({
      min: 6,
    }),
    //check("role", "Not a valid role").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("role").custom(isValidRole), // this is the same as this check("role").custom((role) => isValidRole(role))
    check("email", "Email invalid.").isEmail(),
    check("email").custom(emailExists),
    validateFields,
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "ID is not a valid value.").isMongoId(),
    check("id").custom(isValidUserId),
    check("role").custom(isValidRole),
    validateFields,
  ],
  usersPut
);

router.patch("/", usersPatch);

router.delete(
  "/:id",
  [
    check("id", "ID is not a valid value.").isMongoId(),
    check("id").custom(isValidUserId),
    validateFields,
  ],
  usersDelete
);

module.exports = router;
