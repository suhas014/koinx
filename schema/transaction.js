// mongoose transaction schema
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    address: { type: String, required: true },
    timeStamp: Number,
    blockNumber: Number,
    from: String,
    to: String,
    value: String,
    hash: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);