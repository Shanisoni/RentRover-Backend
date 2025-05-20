const mongoose = require('mongoose');

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
  numberPlate:{
    type: String,
    required: true,
    trim: true
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
  
});

const bookingSchema = new mongoose.Schema(
  {
    paymentStatus: {
      type: String,
      default: 'pending',
    },
    tripType: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    distanceTravelled: {
      type: Number,
      default: 0,
      min: 0,
    },
    bidAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startOdometer: {
      type: Number,
      min: 0,
    },
    endOdometer: {
      type: Number,
      min: 0,
    },
    lateDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    lateFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    car: carSubModelSchema,
    user: userSubModelSchema,
    owner: userSubModelSchema,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);