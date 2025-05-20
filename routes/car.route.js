const express = require("express");

// Import middleware
const carValidationRules = require("../middlewares/validateCarDetails");
const { optionalUploadSingle, uploadToS3 } = require("../middlewares/uploadMiddleware");
const authenticateJWT = require("../middlewares/jwtTokenAuthenticate");
const authorizeRoles = require("../middlewares/roleAuthenticate");

// Import controllers
const { 
  addCar, 
  getCarById, 
  getCars,
  deleteCar, 
  updateCar 
} = require("../controllers/car.controller");


// Initialize router
const router = express.Router();

// Define routes
router.get("/getCars", authenticateJWT, getCars);
router.get("/carId/:id", authenticateJWT, getCarById);
router.post("/addCar", authenticateJWT, authorizeRoles("owner"), optionalUploadSingle, uploadToS3, carValidationRules, addCar); 
router.post("/deleteCar/:id", authenticateJWT, authorizeRoles("owner"), deleteCar);
router.patch("/updateCar/:id", authenticateJWT, authorizeRoles("owner"), updateCar);

// Export the router
module.exports = router;