const express = require("express");

// Import middleware
const validateSignup = require("../middlewares/validateSignup");
const validateLogin = require("../middlewares/validateLogin");
const authenticateJWT = require("../middlewares/jwtTokenAuthenticate");

// Import controllers
const { 
  login, 
  signup, 
  profile 
} = require("../controllers/auth.controller");


// Initialize router
const router = express.Router();

// Define routes
router.get("/profile", authenticateJWT, profile);
router.post("/login", validateLogin, login);
router.post("/signup", validateSignup, signup);

// Export the router 
module.exports = router;
