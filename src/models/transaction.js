module.exports = (sequelize, DataTypes) => {
    const Transactions = sequelize.define("transactions", {
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('Income', 'Expense'),
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
    return Transactions
}