const { Sequelize, DataTypes } = require('sequelize');

// database configuration 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log('connected')
}).catch((err) => {
    console.log('error ' + err)
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../models/users.js')(sequelize, DataTypes)
db.transactions = require('../models/transaction.js')(sequelize, DataTypes)
db.budgets = require('../models/budget.js')(sequelize, DataTypes)

// one to many between users and transactions
db.users.hasMany(db.transactions, {foreignKey: 'userId'})
db.transactions.belongsTo(db.users, {foreignKey: 'userId'})

// one to mant between users and budget
db.users.hasMany(db.budgets, {foreignKey: 'userId'})
db.budgets.belongsTo(db.users, {foreignKey: 'userId'})

db.sequelize.sync({ force: false }).then(() => {
    console.log(' yes re-sync')
})

module.exports = db;