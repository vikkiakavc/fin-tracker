const express = require('express');
const router = express.Router();
const db = require('../db/index');
const Transactions = db.transactions;
const Budgets = db.budgets;
// const Users = db.users;
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const moment = require('moment');
const convertCurrency = require('../utils/exchangeRateService'); // Import your exchange rate service

const monthNamesToNumbers = {
    'january': '01',
    'february': '02',
    'march': '03',
    'april': '04',
    'may': '05',
    'june': '06',
    'july': '07',
    'august': '08',
    'september': '09',
    'october': '10',
    'november': '11',
    'december': '12',
};

router.get('/reports', auth, async (req, res) => {
    try {
        const { month, currency, year } = req.query;

        // Validate input
        if (!month || !currency || !year) {
            return res.status(400).json({ error: 'Month, currency, and year are required parameters' });
        }

        const monthNumber = monthNamesToNumbers[month.toLowerCase()];

        // Construct the start and end date for the month
        const startDate = moment(`${year}-${monthNumber}-01`).startOf('month');
        const endDate = moment(startDate).endOf('month');

        // Get user-specific transactions for the specified period
        const transactions = await Transactions.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [Op.between]: [startDate.toDate(), endDate.toDate()],
                },
            },
        });

        // Get user-specific budget for the specified month
        const budget = await Budgets.findOne({
            where: {
                userId: req.user.id,
                month: month.toLowerCase(),
            },
        });
        // console.log('=========================')
        // console.log(budget)
        // console.log('=========================')


        // Convert amounts to the client-specified currency
        const transactionsInClientCurrency = await Promise.all(transactions.map(async (transaction) => {
            const convertedAmount = await convertCurrency(transaction.amount, transaction.currency, currency)
            return { ...transaction.toJSON(), amount: convertedAmount, currency: currency };
        }));

        const budgetInClientCurrency = {
            ...budget.toJSON(),
            amount: await convertCurrency(budget.amount, budget.currency, currency),
            currency: currency,
        };

        // Now you have transactions and budget in the client-specified currency
        // console.log('Transactions in client currency:', transactionsInClientCurrency);
        // console.log('Budget in client currency:', budgetInClientCurrency);
        // console.log('I am outtttttttt')

        // Calculate total income and expenses in the requested currency
        const totalIncome = transactionsInClientCurrency
            .filter(transaction => transaction.category === 'Income')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        // console.log(totalIncome)

        const totalExpenses = transactionsInClientCurrency
            .filter(transaction => transaction.category === 'Expense')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const netBalance = totalIncome - totalExpenses;
        const remainingBudget = budgetInClientCurrency.amount - totalExpenses;

        // Respond with the financial report
        // console.log('I am done')
        res.status(200).send({
            totalIncome,
            totalExpenses,
            netBalance,
            remainingBudget,
            transactions: transactionsInClientCurrency,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;






