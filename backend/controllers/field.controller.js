const Category = require("../models/category.model");
const Feature = require("../models/feature.model");
const FuelType = require("../models/fuel.model");
const City = require("../models/city.model");

/**
 * @description Add a new vehicle category
 */
let addCategory = async (req, res) => {
    try {
        let { categoryName } = req.body;
        if(!categoryName) return res.status(400).json({ status: false, message: "Category name is required" });

        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
        
        let category = await Category.findOne({ categoryName });
        if (category) return res.status(400).json({ status: false, message: "Category already exists" });
        
        let newCategory = new Category({ categoryName });
        let addedCategory = await newCategory.save();
        res.status(200).json({ status: true, message: "Category added", addedCategory });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * @description Add a new vehicle feature
 */
let addFeature = async (req, res) => {
    try {
        let { featureName } = req.body;
        if(!featureName) return res.status(400).json({ status: false, message: "Feature name is required" });

        featureName = featureName.charAt(0).toUpperCase() + featureName.slice(1).toLowerCase();
       
        let feature = await Feature.findOne({ featureName });
        if(feature) return res.status(400).json({ status: false, message: "Feature already exists" });

        let newFeature = new Feature({ featureName });
        let addedfeature = await newFeature.save();
        res.status(200).json({ status: true, message: "Feature added", addedfeature });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * @description Add a new fuel type
 */
let addFuelType = async (req, res) => {
    try {
        let { fuelName } = req.body;
        if(!fuelName) return res.status(400).json({ status: false, message: "Fuel name is required" });

        fuelName = fuelName.charAt(0).toUpperCase() + fuelName.slice(1).toLowerCase();
        
        let fuelType = await FuelType.findOne({ fuelName });
        if(fuelType) return res.status(400).json({ status: false, message: "Fuel type already exists" });

        let newFuelType = new FuelType({ fuelName });
        let addedFuelType = await newFuelType.save();
        res.status(200).json({ status: true, message: "Fuel type added", addedFuelType });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * @description Add a new city
 */
let addCity = async (req, res) => {
    try {
        let { cityName } = req.body;
        if(!cityName) return res.status(400).json({ status: false, message: "City name is required" });

        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        
        let city = await City.findOne({ cityName });
        if(city) return res.status(400).json({ status: false, message: "City already exists" });

        let newCity = new City({ cityName });
        let addedCity = await newCity.save();
        res.status(200).json({ status: true, message: "City added", addedCity });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * @description Get all vehicle categories
 */
let getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        res.status(200).json({ status: true, categories });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * @description Get all vehicle selected features
 */
let getFeatures = async (req, res) => {
    try {
        let features = await Feature.find();
        res.status(200).json({ status: true, features });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * @description Get all fuel types
 */
let getFuelTypes = async (req, res) => {
    try {
        let fuelTypes = await FuelType.find();
        res.status(200).json({ status: true, fuelTypes });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * @description Get all cities
 */
let getCities = async (req, res) => {
    try {
        let cities = await City.find();
        res.status(200).json({ status: true, cities });
    }
    catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// Export controller functions
module.exports = { 
    addCategory, 
    addFeature, 
    addFuelType, 
    addCity, 
    getCategories, 
    getFeatures, 
    getFuelTypes, 
    getCities 
};

