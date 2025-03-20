const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Make password optional for OAuth users
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true, // Make username optional
    },
    provider: {
        type: DataTypes.STRING, // e.g., "google", "apple"
        allowNull: true,
        defaultValue: "local", // Default to "local" for email/password users
    },
    providerId: {
        type: DataTypes.STRING, // Unique ID provided by the OAuth provider
        allowNull: true, // Null for local users
    },
    avatarUrl: {
        type: DataTypes.STRING, // Profile picture URL from OAuth provider
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: "users",
});

module.exports = User;