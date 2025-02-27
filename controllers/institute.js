const { InstanceError } = require("sequelize");
const Institute = require("../models/educational_institutions")

exports.add_institute = async (req, res) => {
    try{
        const {institution_name, institution_location, course_count, institution_description, institution_overview,course_names} = req.body;

        if (!institution_name) {
            return res.status(400).json({ message: "Institute name is required" });
        }

        const institute = await Institute.create({
            institution_name,
            institution_location,
            course_count,
            institution_description,
            institution_overview,
            course_names
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
            attributes: ["institution_id","institution_name","institution_location","course_count","institution_description","institution_overview","course_names"],

        });
        return res.status(200).json(InstituteDetails);
    }
    catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.GetInstituteById = async (req, res) => {
    try {
        const { id } = req.params;  // Get course ID from the URL parameter
        
        // Find course by its ID
        const InstituteDetails = await Institute.findOne({
            where: { institution_id: id },  // Match with course_id field in DB
            attributes: ["institution_id","institution_name","institution_location","course_count","institution_description","institution_overview","course_names"]
        });

        // If course is not found
        if (!InstituteDetails) {
            return res.status(404).json({ message: "Institute not found" });
        }

        // Return the course details
        return res.status(200).json(InstituteDetails);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateInstitute = async (req, res) => {
    try {
        const { id } = req.params;
        const { institution_name, institution_location, course_count, institution_description, institution_overview,course_names } = req.body;

        // Check if course exists
        const InstituteDetails = await Institute.findOne({ where: { institution_id: id } });
        if (!InstituteDetails) {
            return res.status(404).json({ message: "Institute not found" });
        }

        // Update course details
        await Institute.update(
            { institution_name, institution_location, course_count, institution_description, institution_overview,course_names },
            { where: { institution_id: id } }
        );

        return res.status(200).json({ message: "institute Details updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.deleteInstitute = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if course exists
        const institute = await Institute.findOne({ where: { institution_id: id } });
        if (!institute) {
            return res.status(404).json({ message: "institute not found" });
        }

        // Delete course
        await institute.destroy({ where: { institution_id: id } });

        return res.status(200).json({ message: "institute deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};