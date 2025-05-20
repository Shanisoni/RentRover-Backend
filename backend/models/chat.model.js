const mongoose = require("mongoose");


const userSubModelSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone:{
    type: Number,
  },
});

const carSubModelSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true,
  },
  carName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  fuelType: {
    type: String,
    required: true,
    trim: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerKm: {
    type: Number,
    required: true,
    min: 1
  },
  outStationCharges: {
    type: Number,
    required: true,
    min: 1
  },
  travelled: {
    type: Number,
    default: 0,
    min: 0
  },
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  selectedFeatures: {
    type: Array,
    required: true
  },
});

const chatSchema = new mongoose.Schema({
  car: carSubModelSchema,
  user: userSubModelSchema,
  owner: userSubModelSchema,
},
{
  timestamps: true
});

module.exports = mongoose.model("Chat", chatSchema);