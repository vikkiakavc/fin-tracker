module.exports = (sequelize, DataTypes) => {
    const Budgets = sequelize.define("budgets", {
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        month: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("month", value.toLowerCase());
            },
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("currency", value.toUpperCase());
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return Budgets;
};
