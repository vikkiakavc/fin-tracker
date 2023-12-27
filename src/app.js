const express = require('express');
require('./db/index.js');
const app = express()
const userCtrl = require('./controllers/userCtrl.js')
const transactionCtrl = require('./controllers/transactionCtrl.js')
const budgetCtrl = require('./controllers/budgetCtrl.js')
const reportCtrl = require('./controllers/reportCtrl.js')


const port = process.env.PORT;
app.use(express.json());
app.use(userCtrl)
app.use(transactionCtrl)
app.use(budgetCtrl)
app.use(reportCtrl)


app.get('', (req, res) => {
    res.send('kikiki')
})

app.listen(port, () => {
    console.log('server is up and running on ' + port)
})