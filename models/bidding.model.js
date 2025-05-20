const mongoose = require("mongoose");

const carSubModelSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  carName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  fuelType: {
    type: String,
    required: true,
    trim: true,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 1,
  },
  pricePerKm: {
    type: Number,
    required: true,
    min: 1,
  },
  outStationCharges: {
    type: Number,
    required: true,
    min: 1,
  },
  finePercentage: {
    type: Number,
    default: 50,
    min: 0,
  },
  travelled: {
    type: Number,
    default: 0,
    min: 0,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  selectedFeatures: {
    type: Array,
    required: true,
  },
  numberPlate:{
    type: String,
    required: true,
  },
});

const userSubModelSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date
  },
  
});

const biddingSchema = new mongoose.Schema(
  {
    bidAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date, 
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    tripType: {
      type: String,
      required: true,
    },
    car: carSubModelSchema,
    user: userSubModelSchema,
    owner: userSubModelSchema,
  },
  {
    timestamps: true,
  }
);

const Bid=mongoose.model('Bid', biddingSchema);
module.exports=Bid;
