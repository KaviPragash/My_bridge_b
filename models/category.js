const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        collate: 'utf8_general_ci'
    },
}, {
    timestamps: false,
    tableName: "Category"
});

module.exports = Category;
