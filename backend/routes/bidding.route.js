const express = require("express");

// Import middleware
const authenticateJWT = require("../middlewares/jwtTokenAuthenticate");
const authorizeRoles = require("../middlewares/roleAuthenticate");
const validateBidDetails = require("../middlewares/validateBid");

// Import controllers
const { 
  addBid, 
  acceptBid, 
  rejectBid, 
  getAllBids,
  getBestBidsByCarId
} = require("../controllers/bidding.controller");

// Initialize router
const router = express.Router();

// Define routes
router.get("/getAllBids", authenticateJWT, getAllBids);
router.get("/getBestBidsByCarId/:id", authenticateJWT, authorizeRoles("owner"), getBestBidsByCarId);
router.post("/addBidding", authenticateJWT, authorizeRoles("user"), validateBidDetails, addBid);
router.post("/acceptBid/:id", authenticateJWT, authorizeRoles("owner"), acceptBid);
router.put("/rejectBid/:id", authenticateJWT, authorizeRoles("owner"), rejectBid);

// Export the router
module.exports = router;