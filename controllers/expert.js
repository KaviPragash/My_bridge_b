const Expert = require("../models/expert");
const Category = require("../models/category");
const Language = require("../models/language");
const Location = require("../models/location");

exports.add_expert = async (req, res) => {
    try {
        const {
            expert_name, 
            expert_about, 
            expert_qualification,
            expert_experience, 
            expert_availability, 
            expert_description, 
            expert_subject, 
            category_id, 
            language_id, 
            location_id,
            expert_image
        } = req.body;

        if (!expert_name) {
            return res.status(400).json({ message: "Expert name is required" });
        }

        // Validate category_id, language_id, and location_id exist in their respective tables
        const categoryExists = category_id ? await Category.findByPk(category_id) : null;
        const languageExists = language_id ? await Language.findByPk(language_id) : null;
        const locationExists = location_id ? await Location.findByPk(location_id) : null;

        if (category_id && !categoryExists) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        if (language_id && !languageExists) {
            return res.status(400).json({ message: "Invalid language ID" });
        }
        if (location_id && !locationExists) {
            return res.status(400).json({ message: "Invalid location ID" });
        }

        // Create the course entry
        const expert = await Expert.create({
            expert_name, 
            expert_about,
            expert_qualification, 
            expert_experience, 
            expert_availability, 
            expert_description, 
            expert_subject, 
            category_id, 
            language_id, 
            location_id,
            expert_image
        });

        res.status(201).json({ message: "Expert Details Added successfully", expert });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.GetExpertDetails = async (req, res) => {
    try{
        const ExpertDetails = await Expert.findAll({
            attributes: [
                "expert_id",
                "expert_name",
                "expert_about",
                "expert_qualification",
                "expert_experience",
                "expert_availability",
                "expert_description",
                "expert_image",
                "category_id",
                "language_id",
                "location_id"
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
                }
            ]

        });
        return res.status(200).json(ExpertDetails);
    }
    catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.GetExpertById = async (req, res) => {
    try {
        const { id } = req.params;  // Extract course ID from URL parameter
        
        // Find course by ID
        const expertDetails = await Expert.findOne({
            where: { expert_id: id },  // Match with course_id in DB
            attributes: [
                "expert_id",
                "expert_name",
                "expert_about",
                "expert_qualification",
                "expert_experience",
                "expert_availability",
                "expert_description",
                "expert_image",
                "category_id",
                "language_id",
                "location_id"
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
                }
            ]
        });

        // If course is not found
        if (!expertDetails) {
            return res.status(404).json({ message: "Expert not found" });
        }

        // Return the institute details
        return res.status(200).json(expertDetails);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateExpert = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            expert_name, 
            expert_about, 
            expert_qualification,
            expert_experience, 
            expert_availability, 
            expert_description, 
            expert_subject, 
            category_id, 
            language_id, 
            location_id,
            expert_image
        } = req.body;

        // Check if the institute exists
        const experts = await Expert.findOne({ where: { expert_id: id } });
        if (!experts) {
            return res.status(404).json({ message: "Experts not found" });
        }

        // Validate category_id, language_id, and location_id before updating
        const categoryExists = category_id ? await Category.findByPk(category_id) : null;
        const languageExists = language_id ? await Language.findByPk(language_id) : null;
        const locationExists = location_id ? await Location.findByPk(location_id) : null;


        if (category_id && !categoryExists) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        if (language_id && !languageExists) {
            return res.status(400).json({ message: "Invalid language ID" });
        }
        if (location_id && !locationExists) {
            return res.status(400).json({ message: "Invalid location ID" });
        }

        // Update institute details
        await experts.update({
            expert_name, 
            expert_about, 
            expert_qualification,
            expert_experience, 
            expert_availability, 
            expert_description, 
            expert_subject, 
            category_id, 
            language_id, 
            location_id,
            expert_image
        });

        return res.status(200).json({ message: "Expert details updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.deleteExpert = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the institute exists
        const expert = await Expert.findOne({ where: { expert_id: id } });
        if (!expert) {
            return res.status(404).json({ message: "Expert not found" });
        }

        // Delete the institute
        await expert.destroy();

        return res.status(200).json({ message: "Expert deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};