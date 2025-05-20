const express = require('express');

// Import middleware
const authenticateJWT = require('../middlewares/jwtTokenAuthenticate');
const authorizeRoles = require('../middlewares/roleAuthenticate');

// Import controllers
const { 
  getAllBookings, 
  updateBooking,
  getBookedDates, 
  getBookingsByCarId,  
} = require('../controllers/booking.controller');


// Initialize router
const router = express.Router();

// Define routes
router.get('/getAllBookings', authenticateJWT, getAllBookings);
router.get('/bookedDates/:id', authenticateJWT, getBookedDates);
router.get('/getBookingsByCarId/:id', authenticateJWT, getBookingsByCarId);
router.patch('/updateBooking/:id', authenticateJWT, authorizeRoles("owner"), updateBooking);

// Export the router
module.exports = router; 