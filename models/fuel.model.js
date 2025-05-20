const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  fuelName: {
    type: String,
    required: true,
    trim: true,
    },
});

module.exports = mongoose.model('Fuel', fuelSchema);