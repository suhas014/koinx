// schema to store price and timestamp
const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ethPrice: Number,
});

module.exports = mongoose.model('Price', priceSchema);