// Load environment variables
require('dotenv').config();

// Import required modules
const http = require('http');
const { Server } = require('socket.io');
const express = require("express");
const connectDB = require("./config/db");
const passport = require("./config/passport.config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require('fs');
const morgan = require('morgan');

// Initialize Express app
const app = express();
app.use(cookieParser());
app.use(passport.initialize());

// const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://rentrover-frontend-mv9f.onrender.com",
    methods: ["GET", "POST"]
  }
});
app.set("io", io);

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("New client connected");
  


  // Handle joining a chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Client joined chat room: ${chatId}`);
  });
  
  // Handle sending messages
  socket.on("sendMessage", (data) => {
    io.to(data.chatId).emit("newMessage", data);
  });
  
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected :: ", socket.id);
  });
});

// Enable CORS
app.use(cors());

// Import route modules
const authRoutes = require("./routes/auth.route");
const carRoutes = require("./routes/car.route");  
const biddingRoutes = require("./routes/bidding.route");
const bookingRoutes = require("./routes/booking.route");
const addNewFeildRoutes = require("./routes/field.route");
const chatRoutes = require("./routes/chat.route");
const analysisRoutes = require('./routes/analysis.route');

// Configure middleware for parsing request bodies
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use("/api/auth", authRoutes); 
app.use("/api/car", carRoutes); 
app.use("/api/bidding", biddingRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/field", addNewFeildRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analysis", analysisRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Car Bidding API");
}
);
app.post("/", (req, res) => {
  res.send("Welcome to the Car Bidding API post");
}
);

// Start server and connect to database
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
}); 

module.exports = app; 