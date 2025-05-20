const mongoose = require("mongoose");

// Import models
const Booking = require("../models/booking.model");
const Car = require("../models/car.model");

/**
 * @description Get all bookings for the authenticated user with filtering and pagination
 */
let getAllBookings = async (req, res) => {
  try {
    // Deconstruct query parameters with defaults
    let {
      carName,
      status,
      sortBy = "createdAt",
      sortOrder = -1,
      page = 1,
      limit = 10,
    } = req.query;
    
    // Create query object for filtering
    let query = {};
    
    // Add filters if provided
    if(carName && carName.trim()) {
      query["car.carName"] = { $regex: carName, $options: 'i' };
    }
    if (status) query.paymentStatus = status;

    // Apply role-based filtering
    let user = req.user;
    if (user.role === "owner") {
      // Owners only see bookings for their cars
      query["owner._id"] = user._id;
    } else if (user.role === "user") {
      // Users only see their own bookings
      query["user._id"] = user._id;
    }

    // Convert pagination and sorting values from string to int
    page = parseInt(page);
    limit = parseInt(limit);
    sortOrder = parseInt(sortOrder);
    // Create sort object
    let sortObject = {};
    sortObject[sortBy] = sortOrder;

    // Aggregation pipeline for filtering, sorting, paginating
    const pipeline = [
      { $match: query },
      { $sort: sortObject },
      { $facet: {
        metadata: [ 
          { $count: "total" }, 
          { $addFields: { page: page, limit: limit } } 
        ],
        data: [ 
          { $skip: (page - 1) * limit }, 
          { $limit: limit } 
        ]
      }}
    ];

    // Execute aggregation
    const bookingsData = await Booking.aggregate(pipeline);
    // Extract metadata or provide defaults
    const metadata = bookingsData[0].metadata[0] || { 
      total: 0, 
      page: page, 
      limit: limit 
    };
  
    // Send success response
    res.status(200).json({ 
      success: true, 
      bookings: bookingsData[0].data, 
      metadata: metadata 
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * @description Get all bookings for a specific car
 */
let getBookingsByCarId = async (req, res) => {
  try {
    // Get car ID from request parameters
    let carId = req.params.id;
    
    // Find all bookings for the specified car
    let bookings = await Booking.find({ "car._id": carId });
    
    // Send response with bookings
    res.status(200).json(bookings);
  } catch (error) {
    // Send error response
    res.status(500).json({ message: error });
  }
};

/**
 * @description Get booked dates for a specific car
 */
let getBookedDates = async (req, res) => {
  try {
    // Get car ID from request parameters
    let carId = req.params.id;
    
    // Find all bookings for the specified car
    let bookings = await Booking.find({ "car._id": carId });
    
    // Extract all booked dates from the bookings
    let dates = [];
    bookings.forEach((booking) => {
      let start = new Date(booking.startDate);
      let end = new Date(booking.endDate);
      let date = new Date(start);
      
      // Add each date between start and end date (inclusive)
      while (date <= end) {
        dates.push(date.toISOString().split("T")[0]);
        date.setDate(date.getDate() + 1);
      }
    });
    
    // Send success response with booked dates
    res.status(200).json({ status: true, dates });
  } catch (error) {
    // Send error response
    res.status(500).json({ status: true, message: error });
  }
};

/**
 * @description Update booking odometer readings and calculate final payment
 * @function updateBooking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status and updated booking
 */
let updateBooking = async (req, res) => {
  try {
    // Extract data from request body
    const { bookingId, odometerValue, odometerType, carId } = req.body;
    const owner_id = req.user._id;

    

    // Validate required fields
    if (!bookingId || !odometerValue || !odometerType || !carId) {
      return res.status(400).json({ 
        status: false, 
        message: "Missing required fields" 
      });
    }
   
    // Validate odometer type
    if (odometerType !== 'start' && odometerType !== 'end') {
      return res.status(400).json({
        status: false,
        message: "odometerType must be either 'start' or 'end'"
      });
    }
   
    // Find booking that belongs to the owner
    const findObject = {
      _id: bookingId,
      "owner._id": owner_id,
      paymentStatus: "pending"
    };
   
    const booking = await Booking.findOne(findObject);
  
    // Validate booking exists and owner has permission
    if (!booking) {
      return res.status(404).json({ 
        status: false, 
        message: "Booking not found or you don't have permission to update it" 
      });
    }

    // Handle start odometer reading
    if (odometerType === 'start') {
      // Update booking and car with start odometer reading
      booking.startOdometer = odometerValue;
      booking.car.travelled = odometerValue;
    } 
    // Handle end odometer reading and calculate payment
    else if (odometerType === 'end') {
      // Ensure start odometer reading exists
      if (!booking.startOdometer) {
        return res.status(400).json({
          status: false,
          message: "Start odometer reading must be recorded before end reading"
        });
      }

      // Validate end odometer value is greater than start value
      if (odometerValue < booking.startOdometer) {
        return res.status(400).json({
          status: false,
          message: `End odometer reading cannot be less than start reading (${booking.startOdometer} km)`
        });
      }
   
      // Calculate distance traveled
      const distanceTravelled = odometerValue - booking.startOdometer;
  
      // Calculate rental days
      const days = Math.ceil((booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Calculate any late return days
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of the day for accurate date comparison
      
      const endDate = new Date(booking.endDate);
      endDate.setHours(0, 0, 0, 0); // Set to beginning of the day for accurate date comparison
      
      let lateDays = 0;
      
      // If today's date is after the end date (not equal to), calculate late days
      if (today.getTime() > endDate.getTime()) {
        // Calculate number of days past the end date
        lateDays = Math.ceil((today - endDate) / (1000 * 60 * 60 * 24));
      }
      // If today's date is the same as end date, lateDays remains 0
      

      // Calculate fees
      const distanceFee = distanceTravelled * booking.car.pricePerKm;
      const dailyFee = days * booking.bidAmount;
      
      // Calculate late fee using fine percentage
      const finePercentage = booking.car.finePercentage || 50; // Default to 50% if not set
      const finePerDay = booking.bidAmount + booking.bidAmount * (finePercentage / 100);
      const lateFee = lateDays * finePerDay;

      // Calculate total amount including all fees
      let totalAmount = distanceFee + dailyFee + lateFee;

      // Add outstation charges if applicable
      if(booking.tripType === "outStation") {
        totalAmount = totalAmount + (booking.car.outStationCharges * days);
      }

      // Update booking with final values
      booking.endOdometer = odometerValue;
      booking.distanceTravelled = distanceTravelled;
      booking.totalAmount = totalAmount;
      booking.paymentStatus = "paid";
      booking.lateDays = lateDays;
      booking.lateFee = lateFee;
    }

    // Save the updated booking
    await booking.save();

    // Send success response
    res.status(200).json({
      status: true,
      message: `${odometerType === 'start' ? 'Start' : 'End'} odometer reading updated successfully`,
      booking
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ 
      status: false, 
      message: error.message 
    });
  }
};



// Export controller functions
module.exports = { 
  getAllBookings, 
  updateBooking,
  getBookedDates, 
  getBookingsByCarId
};
