// fetch and store transaction
const {Web3} = require('web3');
const web3 = new Web3();

const axios = require('axios');
const Transaction = require('../schema/transaction');

exports.getTransactions = async (req, res) => {
    const address = req.params.address;
    const apiKey = process.env.ETHERSCAN_API_KEY;

    try {
        // fetch transactions from Etherscan API
        const response = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`);
        const transactions = response.data.result;
        
        const normalTransactions = transactions.filter(tx => {
            if (tx.txreceipt_status === '1') {
                tx.value = web3.utils.fromWei(tx.value.toString(), 'ether');
                return true;
            }
            return false;
        });

        // store transactions in MongoDB
        await Transaction.insertMany(normalTransactions.map(tx => ({ ...tx, address })));

        res.json(normalTransactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};