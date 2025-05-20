const express = require('express');

// Import middleware
const authenticateJWT = require('../middlewares/jwtTokenAuthenticate');
const authorizeRoles = require('../middlewares/roleAuthenticate');

// Import controllers
const { 
  addCategory, 
  addFeature, 
  addFuelType, 
  addCity, 
  getCategories, 
  getFeatures, 
  getFuelTypes, 
  getCities 
} = require('../controllers/field.controller');


// Initialize router
const router = express.Router();

// Define routes
router.get("/getCategories", getCategories);
router.get("/getFeatures", getFeatures);
router.get("/getFuelTypes", getFuelTypes);
router.get("/getCities", getCities);
router.post("/addNewCategory", authenticateJWT, authorizeRoles('admin'), addCategory);
router.post("/addNewFeature", authenticateJWT, authorizeRoles('admin'), addFeature);
router.post("/addNewFuelType", authenticateJWT, authorizeRoles('admin'), addFuelType);
router.post("/addNewCity", authenticateJWT, authorizeRoles('admin'), addCity);

// Export the router
module.exports = router;