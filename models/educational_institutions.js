const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Edu_institution = sequelize.define("educational_institutions",{
    institution_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    institution_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    institution_location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    course_count: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    institution_description: {  // Description
        type: DataTypes.TEXT,
        allowNull: true,
    },
    institution_overview: {  // Description
        type: DataTypes.TEXT,
        allowNull: true,
    },
    course_names: {  // Requirements
        type: DataTypes.TEXT,
        allowNull: true,
    },
    
},{
    timestamps: false,
    tableName: "institutions"
});

module.exports = Edu_institution;