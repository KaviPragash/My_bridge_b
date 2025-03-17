const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./category");
const Language = require("./language");
const Location = require("./location");
const ServiceProvider = require("./serviceProvider");

const Experts = sequelize.define("Experts", {
    expert_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    expert_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expert_about: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expert_qualification: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expert_experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    expert_availability: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expert_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expert_subject: {  
        type: DataTypes.TEXT,
        allowNull: true,
    },
    expert_image: {
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
    ServiceProvider_id: {  // New foreign key
        type: DataTypes.INTEGER,
        references: {
            model: ServiceProvider,
            key: "ServiceProvider_id",
        },
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: "Experts"
});

// Associations
Experts.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Experts, { foreignKey: "category_id" });

Experts.belongsTo(Language, { foreignKey: "language_id" });
Language.hasMany(Experts, { foreignKey: "language_id" });

Experts.belongsTo(Location, { foreignKey: "location_id" });
Location.hasMany(Experts, { foreignKey: "location_id" });

Experts.belongsTo(ServiceProvider, { foreignKey: "ServiceProvider_id" }); // New association
ServiceProvider.hasMany(Experts, { foreignKey: "ServiceProvider_id" });

module.exports = Experts;
