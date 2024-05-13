const axios = require('axios');
const Price = require('../schema/price');

const fetchPrice = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
    const ethPrice = response.data.ethereum.inr;

    const newPrice = new Price({ ethPrice });
    await newPrice.save();
    console.log('Ethereum price saved successfully:', ethPrice);
  } catch (error) {
    console.error('Error fetching or saving Ethereum price:', error);
  }
};

module.exports = fetchPrice;