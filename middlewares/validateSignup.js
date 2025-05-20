const { body } = require("express-validator");

const validateSignup = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),

  body("email")
    .trim()
    .toLowerCase()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one digit")
    .matches(/[\W_]/).withMessage("Password must contain at least one special character"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .isNumeric().withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits"),

  body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "owner"]).withMessage("Invalid role"),

  body("verified")
    .trim()
    .notEmpty().withMessage("Verification status is required")
    .isBoolean().withMessage("Invalid verification status"),
];

module.exports = validateSignup;
