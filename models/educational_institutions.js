const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./category");
const Language = require("./language");
const Location = require("./location");
const InstituteType = require("./institute_type")

const Edu_institution = sequelize.define(
    "educational_institutions",
    {
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
        course_count: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        institution_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        institution_overview: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        course_names: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        institution_image: {
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
        institute_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: InstituteType,
                key: "institute_type_id",
            },
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "institutions",
    }
);

// Associations
Edu_institution.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Edu_institution, { foreignKey: "category_id" });

Edu_institution.belongsTo(Language, { foreignKey: "language_id" });
Language.hasMany(Edu_institution, { foreignKey: "language_id" });

Edu_institution.belongsTo(Location, { foreignKey: "location_id" });
Location.hasMany(Edu_institution, { foreignKey: "location_id" });

Edu_institution.belongsTo(InstituteType, { foreignKey: "institute_type_id" });
InstituteType.hasMany(Edu_institution, { foreignKey: "institute_type_id" });

module.exports = Edu_institution;
