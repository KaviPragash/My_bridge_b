const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceProvider = sequelize.define("ServiceProvider", {
    ServiceProvider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    
    ServiceProvider_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    ServiceProvider_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Ensuring the email is unique
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,  // Ensure the password is provided
    },

    role: {
        type: DataTypes.STRING,
        allowNull: true,  
        defaultValue: 'Service_provider',  // Default role
    },

    DOB: {
        type: DataTypes.DATEONLY, // Storing only the date part
        allowNull: true, // Optional
    },

    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'), // Restrict values
        allowNull: true, // Optional
    },

    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true, // Optional
        validate: {
            isNumeric: true, // Ensures only numbers
            len: [10, 15] // Ensures valid length
        }
    },

    serviceType: {
        type: DataTypes.STRING,
        allowNull: true, // Optional
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: "ServiceProvider",  // Ensure correct table mapping
});

module.exports = ServiceProvider;
