const express = require('express');
const router = express.Router();
const db = require('../db/index');
const Budgets = db.budgets;
const auth = require('../middleware/auth');

router.post('/budgets', auth, async (req, res) => {
    try {
        const { amount, currency, month, year } = req.body;
        const userId = req.user.id;

        // Check if a budget for the given month and year already exists
        const existingBudget = await Budgets.findOne({ where: { month, year } });

        if (existingBudget) {
            // Update if it exists
            await Budgets.update({ amount, currency }, { where: { month, year } });
            res.status(200).send({
                existingBudget,
                message: "Budget updated successfully",
            });
        } else {
            // Create a new budget
            const newBudget = await Budgets.create({ amount, month, year, currency, userId });
            res.status(201).send({
                newBudget,
                message: "Budget created successfully",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;
