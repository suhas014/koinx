require('dotenv').config();
const express = require('express');
const transactionController = require('./api/etherscanAPI');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchPrice = require('./api/coingeckoAPI');
const bal = require('./calculateBalance.js');
const Price = require('./schema/price');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// api endpoint to get transactions for input address
app.get('/transactions/:address', transactionController.getTransactions);
app.listen(port, () => console.log(`Server listening on port ${port}`));

// get current balance and price of ether
app.get('/balance/:address', async (req, res) => {
  const address = req.params.address.toLowerCase();
  
  try {
    const balance = await bal(address);
    console.log(`Balance: ${balance}`)
    
    // fetch latest Ethereum price
    const latestPrice = await Price.findOne().sort({ timestamp: -1 });
    console.log(latestPrice);
    res.json({
      balance,
      ethereumPrice: latestPrice.ethPrice,  // if no price in db
    });
  } catch (error) {
    console.error('Error fetching balance or price:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
});


// schedule fetching price of ethereum every 10 minutes
cron.schedule('*/2 * * * *', fetchPrice);