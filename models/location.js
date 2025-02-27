const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Location = sequelize.define("Location", {
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    location_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        collate: 'utf8_general_ci'
    },
}, {
    timestamps: false,
    tableName: "Location"
});

module.exports = Location;
