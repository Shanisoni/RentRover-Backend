const mongoose = require('mongoose');

const subModelSchema = new mongoose.Schema({
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
  role: {
    type: String,
    required: true,
    trim: true
  },
  phone:{
    type: Number,
  },
});

const carSchema = new mongoose.Schema({
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
    index: true,
  },
  imageUrl: {
    type: String,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  selectedFeatures: {
    type: Array,
    required: true
  },
  finePercentage:{
    type: Number,
    default: 50,
    min:0
  },
  numberPlate:{
    type: String,
    required: true,
    trim: true
  },
  owner: subModelSchema 

}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
