const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdminUser = sequelize.define("AdminUser", {
    AdminUser_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    
    AdminUser_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    email: {
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
        allowNull: true,  // Optional field, you can add roles like 'admin', 'superadmin', etc.
        defaultValue: 'admin',  // Default value if no role is specified
    },

    // Optional: Created and updated timestamps
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,  // Automatically set the creation date
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,  // Automatically set the last update date
    },
}, {
    timestamps: true,  // Enable timestamps for createdAt and updatedAt
    tableName: "AdminUsers",  // Correct table name for consistency
});

module.exports = AdminUser;
