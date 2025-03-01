const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./category");
const Language = require("./language");
const Location = require("./location");

const Course = sequelize.define("Course", {
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    course_include: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    course_organization: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    course_duration: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    course_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    course_learn: {  
        type: DataTypes.TEXT,
        allowNull: true,
    },
    course_description: {  
        type: DataTypes.TEXT,
        allowNull: true,
    },
    course_requirements: {  
        type: DataTypes.TEXT,
        allowNull: true,
    },
    course_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: "category_id",
        },
        allowNull: true,
    },
    language_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Language,
            key: "language_id",
        },
        allowNull: true,
    },
    location_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Location,
            key: "location_id",
        },
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: "Course"
});

// Associations
Course.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Course, { foreignKey: "category_id" });

Course.belongsTo(Language, { foreignKey: "language_id" });
Language.hasMany(Course, { foreignKey: "language_id" });

Course.belongsTo(Location, { foreignKey: "location_id" });
Location.hasMany(Course, { foreignKey: "location_id" });

module.exports = Course;
