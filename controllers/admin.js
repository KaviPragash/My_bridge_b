const bcrypt = require("bcrypt");
const Admin = require("../models/admin_user");
const Category = require("../models/category");
const Location = require("../models/location");
const Language = require("../models/language");
const InstituteType = require("../models/institute_type");
const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const Institute_Type = require("../models/institute_type");

// ✅ Register User ADmin
exports.admin_register = async (req, res) => {
    try {
        const { email, password, AdminUser_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Encrypt password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Admin.create({
            email,
            password: hashedPassword,
            AdminUser_name,
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Login User Admin
exports.Adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: user._id, email: user.email }, "your_jwt_secret", { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.Admin_getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find user by ID
        const user = await Admin.findOne({
            where: {
                AdminUser_id: userId,
            },
        });

        // Check if user is found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user details
        return res.status(200).json({
            AdminUser_id: user.AdminUser_id,
            email: user.email,
            AdminUser_name: user.AdminUser_name,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.add_category = async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Convert to lowercase for case-insensitive comparison
        const categoryNameLower = category_name.toLowerCase();

        // Check if category_name already exists in a case-insensitive manner
        const existingCategory = await Category.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('category_name')), 
                categoryNameLower
            )
        });

        if (existingCategory) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        // Create new category
        const newCategory = await Category.create({ category_name });

        res.status(201).json({
            message: "Category added successfully",
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


exports.get_all_categories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ["category_id", "category_name"], // Fetch only category_name
        });

        return res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.add_location = async (req, res) => {
    try {
        const { location_name } = req.body;

        if (!location_name) {
            return res.status(400).json({ message: "location name is required" });
        }

        // Convert to lowercase for case-insensitive comparison
        const locationNameLower = location_name.toLowerCase();

        // Check if location_name already exists in a case-insensitive manner
        const existingLocation = await Location.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('location_name')), 
                locationNameLower
            )
        });

        if (existingLocation) {
            return res.status(400).json({ message: "Location name already exists" });
        }

        // Create new location
        const newLocation = await Location.create({ location_name });

        res.status(201).json({
            message: "newLocation added successfully",
            location: newLocation
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.get_all_location = async (req, res) => {
    try {
        const location = await Location.findAll({
            attributes: ["location_id", "location_name" ], // Fetch only category_name
        });

        return res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



exports.add_language = async (req, res) => {
    try {
        const { language_name } = req.body;

        if (!language_name) {
            return res.status(400).json({ message: "Language name is required" });
        }

        // Convert to lowercase for case-insensitive comparison
        const languageNameLower = language_name.toLowerCase();

        // Check if location_name already exists in a case-insensitive manner
        const existingLanguage = await Language.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('language_name')), 
                languageNameLower
            )
        });

        if (existingLanguage) {
            return res.status(400).json({ message: "Language name already exists" });
        }

        // Create new location
        const newLanguage = await Language.create({ language_name });

        res.status(201).json({
            message: "newLanguage added successfully",
            Language: newLanguage
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// AGSH

exports.get_all_language = async (req, res) => {
    try {
        const language = await Language.findAll({
            attributes: ["language_id", "language_name" ], // Fetch only category_name
        });

        return res.status(200).json(language);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.institute_type = async (req, res) => {
    try {
        const { institute_type_name } = req.body;

        if (!institute_type_name) {
            return res.status(400).json({ message: "institute type is required" });
        }

        // Convert to lowercase for case-insensitive comparison
        const institute_type_nameLower = institute_type_name.toLowerCase();

        // Check if category_name already exists in a case-insensitive manner
        const existingInstitute_type = await InstituteType.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('institute_type_name')), 
                institute_type_nameLower
            )
        });

        if (existingInstitute_type) {
            return res.status(400).json({ message: "institute name already exists" });
        }

        // Create new category
        const newInstituteType = await InstituteType.create({ institute_type_name });

        res.status(201).json({
            message: "Institute Type added successfully",
            category: newInstituteType
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.get_all_InstituteType = async (req, res) => {
    try {
        const InstituteType = await Institute_Type.findAll({
            attributes: ["institute_type_id", "institute_type_name" ], // Fetch only category_name
        });

        return res.status(200).json(InstituteType);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};