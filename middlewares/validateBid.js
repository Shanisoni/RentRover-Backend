const { body } = require("express-validator");

const validateBidDetails = [
  body("carId")
    .notEmpty().withMessage("Car ID is required"),
  body("bidAmount")
    .isNumeric().withMessage("Bid amount must be a number")
    .notEmpty().withMessage("Bid amount is required")
    .custom((value) => value > 0).withMessage("Bid amount must be greater than 0"),

  body("startDate")
    .isISO8601().withMessage("Start date must be a valid date (ISO format)")
    .notEmpty().withMessage("Start date is required"),

  body("endDate")
    .isISO8601().withMessage("End date must be a valid date (ISO format)")
    .notEmpty().withMessage("End date is required")
    .custom((value, { req }) => {
      return new Date(value) >= new Date(req.body.startDate) || Promise.reject("End date must be after start date");
    }),
];

module.exports = validateBidDetails;
