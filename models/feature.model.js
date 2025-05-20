const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('Feature', featureSchema);