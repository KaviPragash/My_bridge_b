const Course = require("../models/course")
const Category = require("../models/category");
const Language = require("../models/language");
const Location = require("../models/location");
const ServiceProvider = require("../models/serviceProvider");

exports.add_course = async (req, res) => {
    try {
        const {
            course_name, 
            course_include, 
            course_organization, 
            course_duration, 
            course_type, 
            course_learn, 
            course_description, 
            course_requirements, 
            category_id, 
            language_id, 
            location_id,
            course_image,
            ServiceProvider_id // Corrected key name to match the model
        } = req.body;

        if (!course_name) {
            return res.status(400).json({ message: "Course name is required" });
        }

        // Validate foreign keys exist in their respective tables
        const categoryExists = category_id ? await Category.findByPk(category_id) : null;
        const languageExists = language_id ? await Language.findByPk(language_id) : null;
        const locationExists = location_id ? await Location.findByPk(location_id) : null;
        const serviceProviderExists = ServiceProvider_id ? await ServiceProvider.findByPk(ServiceProvider_id) : null;

        if (category_id && !categoryExists) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        if (language_id && !languageExists) {
            return res.status(400).json({ message: "Invalid language ID" });
        }
        if (location_id && !locationExists) {
            return res.status(400).json({ message: "Invalid location ID" });
        }
        if (ServiceProvider_id && !serviceProviderExists) {
            return res.status(400).json({ message: "Invalid service provider ID" });
        }

        // Create the course entry
        const course = await Course.create({
            course_name,
            course_include,
            course_organization,
            course_duration,
            course_type,
            course_learn,
            course_description,
            course_requirements,
            category_id,
            language_id,
            location_id,
            course_image,
            ServiceProvider_id // Ensure this matches the database column
        });

        res.status(201).json({ message: "Course Details Added successfully", course });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



exports.GetCoursedetails = async (req, res) => {
    try {
        const courseDetails = await Course.findAll({
            attributes: [
                "course_id",
                "course_name",
                "course_include",
                "course_organization",
                "course_duration",
                "course_type",
                "course_learn",
                "course_description",
                "course_requirements",
                "course_image"
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

        return res.status(200).json({
            message: "Courses retrieved successfully",
            courses: courseDetails
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


exports.GetCourseById = async (req, res) => {
    try {
        const { id } = req.params;  // Extract course ID from URL parameter
        
        // Find course by ID
        const courseDetails = await Course.findOne({
            where: { course_id: id },  // Match with course_id in DB
            attributes: [
                "course_id",
                "course_name",
                "course_include",
                "course_organization",
                "course_duration",
                "course_type",
                "course_learn",
                "course_description",
                "course_requirements",
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
        if (!courseDetails) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Return course details
        return res.status(200).json({
            message: "Course details retrieved successfully",
            course: courseDetails
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            course_name,
            course_include,
            course_organization,
            course_duration,
            course_type,
            course_learn,
            course_description,
            course_requirements,
            course_image,
            category_id,
            language_id,
            location_id
        } = req.body;

        // Check if course exists
        const course = await Course.findOne({ where: { course_id: id } });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
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

        // Update course details
        await course.update({
            course_name,
            course_include,
            course_organization,
            course_duration,
            course_type,
            course_learn,
            course_description,
            course_requirements,
            course_image,
            category_id,
            language_id,
            location_id
        });

        return res.status(200).json({ message: "Course updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if course exists
        const course = await Course.findOne({ where: { course_id: id } });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Delete the course
        await Course.destroy({ where: { course_id: id } });

        return res.status(200).json({ message: "Course deleted successfully", deletedCourse: course });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.GetCourseBYSP = async (req, res) => {
    try {
        const { ServiceProvider_id } = req.query; // Expecting query parameter (for GET request)

        if (!ServiceProvider_id) {
            return res.status(400).json({ message: "ServiceProvider_id is required" });
        }

        // Find courses by ServiceProvider_id
        const courseDetails = await Course.findAll({
            where: { ServiceProvider_id },
            attributes: [
                "course_id",
                "course_name",
                "course_include",
                "course_organization",
                "course_duration",
                "course_type",
                "course_learn",
                "course_description",
                "course_requirements",
                "category_id",
                "language_id",
                "location_id",
                "ServiceProvider_id"
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
                    model: ServiceProvider,
                    attributes: ["ServiceProvider_id", "ServiceProvider_name"]
                }
            ]
        });

        if (!courseDetails || courseDetails.length === 0) {
            return res.status(404).json({ message: "No courses found for this ServiceProvider" });
        }

        return res.status(200).json({
            message: "Course details retrieved successfully",
            courses: courseDetails
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
