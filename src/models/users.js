const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
            set(email) {
                this.setDataValue("email", email.toLowerCase());
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isLongEnough(value) {
                    if (value.length < 8) {
                        throw new Error("Password should be at least 8 characters long !!");
                    }
                },
                isNotPassword(value) {
                    if (value.toLowerCase() === "password") {
                        throw new Error('Password cannot be "password !!"');
                    }
                },
            },
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [['Male', 'Female']],
                    msg: 'Please select only from Male/Female'
                }
            }
        },
        tokens: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        }
    })
    // Instance method
    Users.prototype.generateAuthToken = async function () {

        const user = this
        // console.log(user)
        const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET)
        // Fetch the user to get the latest tokens array
        const existingTokens = user.getDataValue('tokens');

        // const updatedTokens = [ ...existingTokens, {token}]
        // console.log(updatedTokens)
        existingTokens.push({ token})
        // Save the updated tokens array to the database
        await Users.update(
            { tokens: existingTokens },
            { where: { id: user.id } }
        );

        // await user.save();
        return token;
    }


    // changing values before creating
    Users.beforeCreate(async (user, options) => {
        user.username = user.username.trim();
        user.password = await bcrypt.hash(user.password.trim(), 8);
    });
    // changing values brfore updating
    Users.beforeUpdate(async (user, options) => {
        if (user.changed('username')) {
            user.username = user.username.trim()
        }
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password.trim(), 8);
        }
    })
    // class methods
    Users.findByCredentials = async function (email, password) {
        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            throw new Error("Unable to login!!");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Unable to login!!");
        }

        return user;
    }
    Users.prototype.toJSON = function () {
        const values = { ...this.get() };

        delete values.password;
        delete values.tokens;
        delete values.avatar;

        return values;
    };

    return Users;
}
