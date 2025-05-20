const express = require('express');


// Import middleware
const authenticateToken = require('../middlewares/jwtTokenAuthenticate');
const authorizeRoles = require('../middlewares/roleAuthenticate');

// Import controllers
const { 
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
} = require('../controllers/analysis.controller');


// Initialize router
const router = express.Router();


// owner analysis
router.get("/owner/top-categories", authenticateToken, authorizeRoles("owner"), getTopCategories);
router.get("/owner/top-earning-cities", authenticateToken, authorizeRoles("owner"), getTopEarningCities);
router.get("/owner/top-travelled-cities", authenticateToken, authorizeRoles("owner"), getTopTravelledCities);
router.get("/owner/top-travelled-categories", authenticateToken, authorizeRoles("owner"), getTopTravelledCategories);
router.get("/owner/top-booked-cars", authenticateToken, authorizeRoles("owner"), getTopBookedCars);
router.get("/owner/booking-trend", authenticateToken, authorizeRoles("owner"), getOwnerBookingTrend);
router.get("/owner/trip-type-analysis", authenticateToken, authorizeRoles("owner"), getTripTypeAnalysis);
router.get("/owner/late-returns-analysis", authenticateToken, authorizeRoles("owner"), getLateReturnsAnalysis);
router.get("/owner/performance-analysis", authenticateToken, authorizeRoles("owner"), getPerformanceAnalysis);
router.get('/owner/car-features', authenticateToken, authorizeRoles('owner'), getCarFeatureAnalysis);
router.get('/owner/booking-count', authenticateToken, authorizeRoles('owner'), bookingCountAnalysis);

// admin analysis
router.get("/admin/revenue-summary", authenticateToken, authorizeRoles("admin"), getRevenueSummary);
router.get("/admin/top-owners", authenticateToken, authorizeRoles("admin"), getTopOwners);
router.get("/admin/top-renters", authenticateToken, authorizeRoles("admin"), getTopRenters);
router.get("/admin/bookings-by-status", authenticateToken, authorizeRoles("admin"), getBookingsByStatus);
router.get("/admin/booking-trend", authenticateToken, authorizeRoles("admin"), getBookingTrend);
router.get("/admin/category-distribution", authenticateToken, authorizeRoles("admin"), getCategoryDistribution);
router.get("/admin/city-distribution", authenticateToken, authorizeRoles("admin"), getCityDistribution);
router.get("/admin/user-growth", authenticateToken, authorizeRoles("admin"), getUserGrowth);




// Export the router
module.exports = router;