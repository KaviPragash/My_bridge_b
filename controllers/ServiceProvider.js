const bcrypt = require("bcrypt");
const ServiceProvider = require("../models/serviceProvider");
const jwt = require("jsonwebtoken");
// ✅ Register User
exports.ServiceProvider_Register = async (req, res) => {
    try {
        const { ServiceProvider_email, password, ServiceProvider_name, DOB, gender, phoneNumber } = req.body;

        if (!ServiceProvider_email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Encrypt password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const Service_provider = await ServiceProvider.create({
            ServiceProvider_email,
            password: hashedPassword,
            ServiceProvider_name,
            DOB,
            gender,
            phoneNumber,
        });

        res.status(201).json({ message: "Service Provider registered successfully", Service_provider });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Login User
exports.ServiceProvider_login = async (req, res) => {
    try {
        const { ServiceProvider_email, password } = req.body;

        if (!ServiceProvider_email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email using Sequelize
        const serviceProvider = await ServiceProvider.findOne({ where: { ServiceProvider_email } });

        if (!serviceProvider) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, serviceProvider.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: serviceProvider.ServiceProvider_id, email: serviceProvider.ServiceProvider_email },
            "your_jwt_secret",
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token, serviceProvider });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get All Users from the Database Table 
exports.AllServiceProviders = async (req, res) => {
    try {
        const ServiceProviders = await ServiceProvider.findAll({
            attributes: [
                "ServiceProvider_id",
                "ServiceProvider_name",
                "ServiceProvider_email",
                "role",
                "DOB",
                "gender",
                "phoneNumber",
                "serviceType",
                "createdAt",
                "updatedAt"
            ]
        });

        // If no users are found, return a 404 response
        if (!ServiceProviders || ServiceProviders.length === 0) {
            return res.status(404).json({ message: "No ServiceProviders found" });
        }

        // Return the list of users
        res.status(200).json({ ServiceProviders });
    } catch (error) {
        console.error("Error fetching ServiceProviders:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.ServiceProviderById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find user by ID
        const user = await ServiceProvider.findOne({
            where: {
                ServiceProvider_id: userId,
            },
        });

        // Check if user is found
        if (!user) {
            return res.status(404).json({ message: "ServiceProvider not found" });
        }

        // Return user details
        return res.status(200).json({
            ServiceProvider_id: user.ServiceProvider_id,
            ServiceProvider_email: user.ServiceProvider_email,
            ServiceProvider_name: user.ServiceProvider_name,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


// Update Service Provider
exports.updateServiceProvider = async (req, res) => {
    try {
        const { id } = req.params; // Extract ServiceProvider ID
        const {
            ServiceProvider_name,
            ServiceProvider_email,
            password,
            role,
            DOB,
            gender,
            phoneNumber,
            serviceType,
        } = req.body;

        // Find service provider
        const serviceProvider = await ServiceProvider.findByPk(id);
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        // Prepare update data
        const updateData = {};
        if (ServiceProvider_name) updateData.ServiceProvider_name = ServiceProvider_name;
        if (ServiceProvider_email) updateData.ServiceProvider_email = ServiceProvider_email;
        if (role) updateData.role = role;
        if (DOB) updateData.DOB = DOB;
        if (gender) updateData.gender = gender;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (serviceType) updateData.serviceType = serviceType;

        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Update Service Provider
        await serviceProvider.update(updateData);

        return res.status(200).json({ message: "Service Provider updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating Service Provider", error: error.message });
    }
};

// Delete Service Provider
exports.deleteServiceProvider = async (req, res) => {
    try {
        const { id } = req.params;

        const serviceProvider = await ServiceProvider.findByPk(id);
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service Provider not found" });
        }

        await ServiceProvider.destroy({ where: { ServiceProvider_id: id } });

        return res.status(200).json({ message: "Service Provider deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting Service Provider", error: error.message });
    }
};

