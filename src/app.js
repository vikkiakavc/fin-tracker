const express = require('express');
require('./db/index.js');
const app = express()
const userCtrl = require('./controllers/userCtrl.js')
const transactionCtrl = require('./controllers/transactionCtrl.js')


const port = 3000;
app.use(express.json());
app.use(userCtrl)
app.use(transactionCtrl)


app.get('', (req, res) => {
    res.send('kikiki')
})

app.listen(port, () => {
    console.log('server is up and running on ' + port)
})