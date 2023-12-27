const express = require('express')
const router = express.Router()
const db = require('../db/index')
const Transactions = db.transactions
const auth = require('../middleware/auth')
const validCurrencyCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

router.post('/transactions', auth, async (req, res) => {
    try {
        const { amount, category, paymentMethod, currency } = req.body;
        // Validate currency input
        const isValidCurrency = validCurrencyCodes.includes(currency);
        if (!isValidCurrency) {
            return res.status(404).send({ error: 'Invalid currency code' })
        }
        const date = new Date();
        const userId = req.user.id
        const transaction = await Transactions.create({ amount, date, category, paymentMethod, currency, userId })
        res.status(201).send({ newTransaction: transaction });
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/transactions', auth, async (req, res) => {
    try {
        const transactions = await Transactions.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transactions.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        await transaction.destroy();
        res.status(200).send({transaction,
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router