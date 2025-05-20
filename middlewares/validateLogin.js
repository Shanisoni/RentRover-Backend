const { body } = require("express-validator");

const validateLogin = [     
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required"),
];

module.exports = validateLogin;
  