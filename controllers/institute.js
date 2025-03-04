const { InstanceError } = require("sequelize");
const Institute = require("../models/educational_institutions")
const Category = require("../models/category");
const Language = require("../models/language");
const Location = require("../models/location");
const InstituteType = require("../models/institute_type");

exports.add_institute = async (req, res) => {
    try{
        const {institution_name,
            course_count, 
            institution_description, 
            institution_overview,
            course_names,
            institution_image,
            category_id,
            language_id,
            location_id,
            institute_type_id
        } = req.body;

        if (!institution_name) {
            return res.status(400).json({ message: "Institute name is required" });
        }

        const institute = await Institute.create({
            institution_name,
            course_count, 
            institution_description, 
            institution_overview,
            course_names,
            institution_image,
            category_id,
            language_id,
            location_id,
            institute_type_id
        });

        res.status(201).json({ message: "Institute Details Added successfully", institute });

    }
    catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.GetInstituteDetails = async (req, res) => {
    try{
        const InstituteDetails = await Institute.findAll({
            attributes: [
                "institution_id",
                "institution_name",
                "course_count",
                "institution_description",
                "institution_overview",
                "course_names",
                "institution_image",

            ],
            include: [
                {
                    model: Category,
                    attributes: ["category_id", "category_name"]
                },
                {
                    model: Language,
                    attributes: ["language_id", "language_name"]
                },
                {
                    model: Location,
                    attributes: ["location_id", "location_name"]
                },
                {
                    model: InstituteType,
                    attributes: ["institute_type_id", "institute_type_name"]
                }
            ]

        });
        return res.status(200).json(InstituteDetails);
    }
    catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.GetInstituteById = async (req, res) => {
    try {
        const { id } = req.params;  // Get institute ID from the URL parameter
        
        // Find institute by its ID, including related models
        const InstituteDetails = await Institute.findOne({
            where: { institution_id: id },  // Match with institution_id field in DB
            attributes: [
                "institution_id",
                "institution_name",
                "course_count",
                "institution_description",
                "institution_overview",
                "course_names",
                "institution_image",
            ],
            include: [
                {
                    model: Category,
                    attributes: ["category_id", "category_name"]
                },
                {
                    model: Language,
                    attributes: ["language_id", "language_name"]
                },
                {
                    model: Location,
                    attributes: ["location_id", "location_name"]
                },
                {
                    model: InstituteType,
                    attributes: ["institute_type_id", "institute_type_name"]
                }
            ]
        });

        // If institute is not found
        if (!InstituteDetails) {
            return res.status(404).json({ message: "Institute not found" });
        }

        // Return the institute details
        return res.status(200).json(InstituteDetails);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


exports.updateInstitute = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            institution_name, 
            institution_location, 
            course_count, 
            institution_description, 
            institution_overview, 
            course_names, 
            institution_image, 
            category_id, 
            language_id, 
            location_id, 
            institute_type_id 
        } = req.body;

        // Check if the institute exists
        const institute = await Institute.findOne({ where: { institution_id: id } });
        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        // Validate category_id, language_id, and location_id before updating
        const categoryExists = category_id ? await Category.findByPk(category_id) : null;
        const languageExists = language_id ? await Language.findByPk(language_id) : null;
        const locationExists = location_id ? await Location.findByPk(location_id) : null;
        const InstituteTypeExists = institute_type_id ? await InstituteType.findByPk(institute_type_id) : null;


        if (category_id && !categoryExists) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        if (language_id && !languageExists) {
            return res.status(400).json({ message: "Invalid language ID" });
        }
        if (location_id && !locationExists) {
            return res.status(400).json({ message: "Invalid location ID" });
        }
        if (institute_type_id && !InstituteTypeExists) {
            return res.status(400).json({ message: "Invalid Institute ID" });
        }

        // Update institute details
        await institute.update({
            institution_name, 
            institution_location, 
            course_count, 
            institution_description, 
            institution_overview, 
            course_names, 
            institution_image, 
            category_id, 
            language_id, 
            location_id, 
            institute_type_id
        });

        return res.status(200).json({ message: "Institute details updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.deleteInstitute = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the institute exists
        const institute = await Institute.findOne({ where: { institution_id: id } });
        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        // Delete the institute
        await institute.destroy();

        return res.status(200).json({ message: "Institute deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
