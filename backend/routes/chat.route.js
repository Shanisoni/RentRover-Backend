const express = require("express");

// Import middleware
const authenticateJWT = require("../middlewares/jwtTokenAuthenticate");
const authorizeRoles = require("../middlewares/roleAuthenticate");
const { optionalUploadSingle, uploadToS3 } = require("../middlewares/uploadMiddleware");

// Import controllers
const { 
  getChats, 
  addChat, 
  addMessage, 
  getConversations 
} = require("../controllers/chat.controller");


// Initialize router
const router = express.Router();

// Define routes
router.get("/getChats", authenticateJWT, getChats);
router.get("/getConversation/:id", authenticateJWT, getConversations);
router.post("/addNewChat", authenticateJWT, authorizeRoles("user"), addChat);
router.post("/sendMessage/:id", authenticateJWT, optionalUploadSingle, uploadToS3, addMessage);

// Export the router
module.exports = router; 