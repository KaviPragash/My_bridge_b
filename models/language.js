const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Language = sequelize.define("Language", {
    language_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    language_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: "Language"
});

module.exports = Language;
