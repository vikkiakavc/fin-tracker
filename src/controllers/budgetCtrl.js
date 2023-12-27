const express = require('express')
const router = express.Router()
const db = require('../db/index')
const Budgets = db.budgets
const auth = require('../middleware/auth')


router.post('/budgets', auth, async (req, res) => {
    try {
        const { amount, currency, month } = req.body;
        console.log(typeof(amount))
        const userId = req.user.id
        console.log(currency)
        // Check if a budget for the given month already exists
        const existingBudget = await Budgets.findOne({ where: { month } });

        // update if exist
        if (existingBudget) {
            await Budgets.update({ amount, currency }, { where: { month } });
            res.status(200).send({
                existingBudget,
                message: "Budget updated successfully"
            });
        } else {
            const newBudget = await Budgets.create({ amount, month, currency, userId});
            res.status(201).send({
                newBudget,
                message: "Budget created successfully"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


module.exports = router