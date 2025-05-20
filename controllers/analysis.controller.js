
const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const Car = require("../models/car.model");


// owner analysis

const getTopCategories = async (req, res) => {
  try{
  const { startDate, endDate } = req.query;
  const ownerId = req.user._id;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const analytics = await Booking.aggregate([
    { 
      $match: { 
        "owner._id": ownerId,
        startDate: { $gte: start, $lte: end },
        paymentStatus: "paid" 
      } 
    },
    { $project: { "car.category": 1, totalAmount: 1 } },
    { $group: { _id: "$car.category", revenue: { $sum: "$totalAmount" } } },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, category: "$_id", revenue: 1 } }
  ]);
  return res.status(200).json({
    success: true,
    data: analytics,
  });
}
catch(error){
  return res.status(500).json({
    success: false,
    message: error
  })
}
}

const getTopEarningCities = async (req, res) => {
  try{
  const { startDate, endDate } = req.query;
  const ownerId = req.user._id;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const analytics = await Booking.aggregate([
    { 
      $match: { 
        "owner._id": ownerId,
        startDate: { $gte: start, $lte: end },
        paymentStatus: "paid" 
      } 
    },
    { $project: { "car.city": 1, totalAmount: 1 } },
    { $group: { _id: "$car.city", revenue: { $sum: "$totalAmount" } } },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, city: "$_id", revenue: 1 } }
  ]);
 
  return res.status(200).json({
    success: true,
    data: analytics,
  });
}
catch(error){
  return res.status(500).json({
    success: false,
    message: error
  })
}
}

const getTopTravelledCities = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      { 
        $match: { 
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end },
          paymentStatus: "paid" 
        } 
      },
      { $project: { "car.city": 1, distanceTravelled: 1 } },
      { $group: { _id: "$car.city", distance: { $sum: "$distanceTravelled" } } },
      { $sort: { distance: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, city: "$_id", distance: 1 } }
    ]);
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getTopTravelledCategories = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      { 
        $match: { 
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end },
          paymentStatus: "paid" 
        } 
      },
      { $project: { "car.category": 1, distanceTravelled: 1 } },
      { $group: { _id: "$car.category", distance: { $sum: "$distanceTravelled" } } },
      { $sort: { distance: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, category: "$_id", distance: 1 } }
    ]);
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getTopBookedCars = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      { 
        $match: { 
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end }
        } 
      },
      {
        $project: {
          "car.carName": 1,
        }
      },
      { $group: { _id: "$car.carName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, carName: "$_id", count: 1 } }
    ]);
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getOwnerBookingTrend = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const analytics = await Booking.aggregate([
      { 
        $match: { 
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end }
        } 
      },
      { $project: { startDate: 1 } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } }
    ])
    return res.status(200).json({ 
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getTripTypeAnalysis = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      { 
        $match: { 
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end },
          paymentStatus: "paid" 
        } 
      },
      {
        $group: {
          _id: "$tripType",
          totalBookings: { $sum: 1 },
          avgRevenue: { $avg: "$totalAmount" },
          totalRevenue: { $sum: "$totalAmount" },
          avgDistance: { $avg: "$distanceTravelled" },
          avgBidAmount: { $avg: "$bidAmount" }
        }
      },
      {
        $project: {
          _id: 0,
          tripType: "$_id",
          metrics: {
            totalBookings: "$totalBookings",
            avgRevenue: { $round: ["$avgRevenue", 2] },
            totalRevenue: "$totalRevenue",
            avgDistance: { $round: ["$avgDistance", 2] },
            avgBidAmount: { $round: ["$avgBidAmount", 2] }
          }
        }
      }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false, 
      message: error
    })
  }
}

const getLateReturnsAnalysis = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      { 
        $match: { 
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end },
          lateDays: { $gt: 0 }, 
          paymentStatus: "paid" 
        } 
      },
      {
        $group: {
          _id: null,
          totalLateReturns: { $sum: 1 },
          avgLateDays: { $avg: "$lateDays" },
          totalLateFees: { $sum: "$lateFee" },
          maxLateDays: { $max: "$lateDays" }
        }
      },
      {
        $project: {
          _id: 0,
          totalLateReturns: 1,
          avgLateDays: { $round: ["$avgLateDays", 1] },
          totalLateFees: 1,
          maxLateDays: 1
        }
      }
    ]);
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getPerformanceAnalysis = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      { 
        $match: { 
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end },
          paymentStatus: "paid" 
        } 
      },
      {
        $group: {
          _id: "$car._id",
          carName: { $first: "$car.carName" },
          totalTrips: { $sum: 1 },
          totalDistance: { $sum: { $subtract: ["$endOdometer", "$startOdometer"] } },
          avgTripDistance: { $avg: { $subtract: ["$endOdometer", "$startOdometer"] } },
          maxTripDistance: { $max: { $subtract: ["$endOdometer", "$startOdometer"] } }
        }
      },
      {
        $project: {
          _id: 0,
          carName: 1,
          metrics: {
            totalTrips: "$totalTrips",
            totalDistance: "$totalDistance",
            avgTripDistance: { $round: ["$avgTripDistance", 2] },
            maxTripDistance: "$maxTripDistance"
          }
        }
      },
      { $sort: { "metrics.totalDistance": -1 } },
      { $limit: 10 }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getCarFeatureAnalysis = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const ownerId = req.user._id;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const analytics = await Booking.aggregate([
      {
        $match: {
          "owner._id": ownerId,
          startDate: { $gte: start, $lte: end },
          paymentStatus: "paid"
        }
      },
      {
        $project: {
          month: { $month: "$startDate" },
          year: { $year: "$startDate" },
          "car.selectedFeatures": 1
        }
      },
      { $unwind: "$car.selectedFeatures" },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            feature: "$car.selectedFeatures"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          count: -1,
          "_id.feature": 1
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year"
          },
          topFeature: { $first: "$_id.feature" },
          count: { $first: "$count" }
        }
      },
      {
        $sort: { 
          "_id.year": 1, 
          "_id.month": 1 
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          feature: "$topFeature",
          count: 1
        }
      }
    ]);
    

    return res.status(200).json({
      success: true,
      data: analytics
    });
  } catch(error) {
    return res.status(500).json({
      success: false,
      message: error
    });
  }
};

const bookingCountAnalysis = async (req, res) => {
  try {
    const owner_id = req.user._id;

    const analytics = await Booking.aggregate([
      {
        $match: {
          "owner._id": owner_id,
        },
      },
      {
        $group: {
          _id: "$paymentStatus",
          totalRevenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
      error: error.message,
    });
  }
};

// admin analysis

const getRevenueSummary = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          startDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          avgBookingValue: { $avg: "$totalAmount" },
          totalBookings: { $sum: 1 },
          totalDistance: { $sum: "$distanceTravelled" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          avgBookingValue: 1,
          totalBookings: 1,
          totalDistance: 1,
        },
      },
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getTopOwners = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          startDate: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          ownerId: "$owner._id",
          ownerName: "$owner.name",
          revenue: "$totalAmount",
        }
      },
      {
        $group: {
          _id: "$ownerId",
          ownerName: { $first: "$ownerName" },
          revenue: { $sum: "$revenue" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, ownerId: "$_id", ownerName: 1, revenue: 1, bookings: 1 } }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getTopRenters = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          startDate: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          userId: "$user._id",
          userName: "$user.name",
          spent: "$totalAmount"
        }
      },
      {
        $group: {
          _id: "$userId",
          userName: { $first: "$userName" },
          spent: { $sum: "$spent" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { spent: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, userId: "$_id", userName: 1, spent: 1, bookings: 1 } }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getBookingsByStatus = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      {
        $match: {
          startDate: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          paymentStatus: 1,
          count: 1
        }
      },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, paymentStatus: "$_id", count: 1 } }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getBookingTrend = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Booking.aggregate([
      {
        $match: {
          startDate: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          startDate: 1,
          totalAmount: 1,
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", bookings: 1, revenue: 1 } }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getCategoryDistribution = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Car.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          category: 1
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: "$_id", count: 1 } }
    ])  
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getCityDistribution = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await Car.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          city: 1
        }
      },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, city: "$_id", count: 1 } }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}

const getUserGrowth = async (req, res) => {
  try{
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const analytics = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          createdAt: 1,
          role: 1
        }
      }, 
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          owners: {
            $sum: { $cond: [{ $eq: ["$role", "owner"] }, 1, 0] },
          },
          renters: {
            $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", owners: 1, renters: 1 } }
    ])
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error
    })
  }
}



// Export controller functions
module.exports = {
  getTopCategories,
  getTopEarningCities,
  getTopTravelledCities,
  getTopTravelledCategories,
  getTopBookedCars,
  getOwnerBookingTrend,
  getTripTypeAnalysis,
  getLateReturnsAnalysis,
  getPerformanceAnalysis,
  getRevenueSummary,
  bookingCountAnalysis,
  getTopOwners,
  getTopRenters,
  getBookingsByStatus,
  getBookingTrend,
  getCategoryDistribution,
  getCityDistribution,
  getUserGrowth,
  getCarFeatureAnalysis
};
 