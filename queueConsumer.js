// Load environment variables
require('dotenv').config();

// Import required modules
const { getBidFromQueue } = require('./utils/sqs/consumer');
const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
});

(async () => {
  await connectDB();

  setInterval(async () => {
    try {
      const result = await getBidFromQueue();
      console.log("result", result);
      if (result && result.Messages && result.Messages.length > 0) {
        const message = JSON.parse(result.Messages[0].Body);
        io.to(message.user._id).emit('newBid', {
          userId: message.user._id,
          message: 'Bid placed successfully!',
          bid: message
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }, 3000);
})();


const PORT = process.env.PORT1 || 3000;
server.listen(PORT, () => {
  console.log(`Queue Consumer Server running on port ${PORT}`);
});
