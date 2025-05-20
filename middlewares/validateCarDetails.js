const { body } = require("express-validator");

const carValidationRules = [
  body("carName").trim().notEmpty().withMessage("Car name is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("fuelType").trim().notEmpty().withMessage("Fuel type is required"),
  body("basePrice")
    .isNumeric()
    .withMessage("Base price must be a number")
    .custom((value) => value > 0)
    .withMessage("Base price must be greater than 0"),
  body("pricePerKm")
    .isNumeric()
    .withMessage("Price per km must be a number")
    .custom((value) => value > 0)
    .withMessage("Price per km must be greater than 0"),
  body("outStationCharges")
    .isNumeric()
    .withMessage("Outstation charges must be a number")
    .custom((value) => value > 0)
    .withMessage("Outstation charges must be greater than 0"),
  body("travelled")
    .isNumeric()
    .withMessage("Travelled distance must be a number")
    .custom((value) => value >= 0)
    .withMessage("Travelled distance must be at least 0"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("finePercentage")
    .isNumeric()
    .withMessage("Fine percentage must be a number")
    .custom((value) => value >= 0)
    .withMessage("Fine percentage must be at least 0"),
  body("selectedFeatures")
  .trim().notEmpty()
    .withMessage("Selected features are required"),
  body("numberPlate")
    .trim().notEmpty()
    .withMessage("Number plate is required"),
  body("imageUrl")
    .trim().notEmpty()
    .withMessage("Image URL is required"),
];

module.exports = carValidationRules;
