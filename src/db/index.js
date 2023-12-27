const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME || "fintrack", process.env.DB_USER || "devuser", process.env.DB_PASSWORD || "Vik@120501", {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
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

// one to many between users and transactions
db.users.hasMany(db.transactions, {foreignKey: 'userId'})
db.transactions.belongsTo(db.users, {foreignKey: 'userId'})

db.sequelize.sync({ force: false }).then(() => {
    console.log(' yes re-sync')
})

module.exports = db;