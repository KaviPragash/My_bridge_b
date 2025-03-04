const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Institute_Type = sequelize.define("Institute_type", {
    institute_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    institute_type_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: "Institute_type"
});

module.exports = Institute_Type;
