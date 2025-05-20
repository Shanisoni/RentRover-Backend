/**
 * @description Controller for managing car listings and operations
 * @module controllers/car
 */

// Import required dependencies
const { validationResult } = require("express-validator");
const Car = require('../models/car.model');

/**
 * @description Add a new car listing
 */
let addCar = async (req, res) => {
  try { 
    // Check validation middleware result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }
   
    // Deconstruct details from request body
    let { 
      carName, 
      category, 
      numberPlate, 
      fuelType, 
      basePrice, 
      pricePerKm, 
      outStationCharges, 
      travelled, 
      city, 
      imageUrl, 
      finePercentage, 
      selectedFeatures, 
    } = req.body;
   
    // Parse selectedFeatures JSON string to array
    selectedFeatures = JSON.parse(selectedFeatures);
   
    // Create car object with owner details
    let carObject = { 
      carName, 
      category, 
      numberPlate, 
      fuelType, 
      basePrice, 
      pricePerKm, 
      outStationCharges, 
      travelled, 
      city, 
      imageUrl, 
      selectedFeatures, 
      finePercentage,
      owner: req.user 
    };

    // Save car to database
    let car = new Car(carObject);
    let addedCar = await car.save();
    
    // Send success response
    res.status(201).json({ 
      status: true, 
      message: "Car created", 
      car: addedCar 
    });
  }
  catch (error) {
    // Send error response
    res.status(500).json({ 
      status: false, 
      message: error.message 
    });
  }
};

/**
 * @description Get car details by ID
 * @function getCarById
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Car ID to retrieve
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with car details
 */
let getCarById = async (req, res) => {
  try {
    // Create query to find active car by ID
    let findObject = {
      _id: req.params.id, 
      isDisabled: false
    };

    // Find car by ID
    let car = await Car.findOne(findObject);
    if (!car) return res.status(404).json({ 
      status: false, 
      message: "Car not found" 
    });

    // Send success response with car details
    res.status(200).json({ 
      status: true, 
      car 
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ 
      status: false, 
      message: error.message 
    });
  }
};

/**
 * @description Get cars with filtering, sorting and pagination
 */
let getCars = async (req, res) => {
  try {
    // Deconstruct query parameters with defaults
    let {
      carName, 
      city, 
      category, 
      fuelType, 
      sortBy = "createdAt", 
      sortOrder = -1, 
      page = 1, 
      limit = 3
    } = req.query;
   
    // Create query object for filtering
    let query = {};
    
    // Add filters if provided
    if (city) query.city = city;
    if (category) query.category = category;
    if (fuelType) query.fuelType = fuelType;
    if (carName && carName.trim()) {
      query.carName = { $regex: carName, $options: 'i' };
    }

    // Apply role-based filtering
    let user = req.user;
    if (user.role === "owner") {
      // Owners only see their own cars
      query["owner._id"] = user._id;
    } 
    else if (user.role === "user") {
      // Users only see active cars
      query.isDisabled = false;
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
    let carsData = await Car.aggregate(pipeline);
    // Extract metadata or provide defaults
    const metadata = carsData[0].metadata[0] || {
      total: 0,
      page: page,
      limit: limit,
    };
  
    // Send success response
    res.status(200).json({
      status: true, 
      cars: carsData[0].data, 
      metadata: metadata
    });
  }
  catch (error) {
    // Send error response
    res.status(500).json({
      status: false, 
      message: error.message
    });
  }
};

/**
 * @description Soft delete (disable) a car
 */
let deleteCar = async (req, res) => {
  try {
    // Create find object to ensure car belongs to the owner
    let findObject = {
      _id: req.params.id, 
      "owner._id": req.user._id, 
      isDisabled: false
    };
    
    // Soft delete by updating isDisabled flag
    let car = await Car.findOneAndUpdate(
      findObject, 
      { $set: { isDisabled: true } }
    );
    
    // Check if car exists and belongs to owner
    if (!car) return res.status(404).json({
      status: false, 
      message: "Car not found"
    });

    // Send success response
    res.status(200).json({
      status: true, 
      message: "Car disabled"
    });
  }
  catch (error) {
    // Send error response
    res.status(500).json({
      status: false, 
      message: error.message
    });
  }
};

/**
 * @description Update car details
 */
let updateCar = async (req, res) => {
  try {
    // Deconstruct update fields from request body
    let {
      carName, 
      basePrice, 
      pricePerKm, 
      outStationCharges, 
      finePercentage, 
      isDisabled
    } = req.body;

    // Create update object with only provided fields
    let updateObject = {};

    if (carName !== undefined && carName !== null) updateObject.carName = carName;
    if (basePrice !== undefined && basePrice !== null) updateObject.basePrice = basePrice;
    if (pricePerKm !== undefined && pricePerKm !== null) updateObject.pricePerKm = pricePerKm;
    if (outStationCharges !== undefined && outStationCharges !== null) updateObject.outStationCharges = outStationCharges;
    if (finePercentage !== undefined && finePercentage !== null) updateObject.finePercentage = finePercentage;
    if (isDisabled !== undefined && isDisabled !== null) updateObject.isDisabled = isDisabled;

    // Create find object to ensure car belongs to the owner
    let findObject = {
      _id: req.params.id, 
      "owner._id": req.user._id
    };

    // Update car details
    let car = await Car.findOneAndUpdate(
      findObject, 
      { $set: updateObject }, 
      { new: true }
    );
    
    // Check if car exists and belongs to owner
    if (!car) return res.status(404).json({
      status: false, 
      message: "Car not found"
    });

    // Send success response
    res.status(200).json({
      status: true, 
      message: "Car updated", 
      car
    });
  }
  catch (error) {
    // Send error response
    res.status(500).json({
      status: false, 
      message: error.message
    });
  }
};

// Export controller functions
module.exports = { 
  addCar, 
  getCarById, 
  getCars, 
  deleteCar, 
  updateCar 
};