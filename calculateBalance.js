const BigNumber = require('bignumber.js'); // For handling large numbers
const Transaction = require('./schema/transaction');

const calculateBalance = async (address) => {
  // fetch transactions of the input address
  const transactions = await Transaction.find({
    $or: [{ from: address }, { to: address }],
  });

  // initialise balance to 0
  let balance = new BigNumber(0);

  // iterate through transactions and modify balance
  for (const tx of transactions) {
    // Check if value can be parsed into a number
    if (!isNaN(tx.value)) {
      const value = new BigNumber(tx.value); // Convert value string to BigNumber
      if (tx.to.toLowerCase() === address) {
        balance = balance.plus(value); // Add to balance if 'to' address matches
      } else if (tx.from.toLowerCase() === address) {
        balance = balance.minus(value); // Subtract from balance if 'from' address matches 
      }
    } else {
      console.error(`Invalid value for transaction: ${tx.value}`);
    }
  }

  // return balance as a string (optional, for better readability)
  return balance.toString(); 
};

module.exports = calculateBalance;
