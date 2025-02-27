const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


// ✅ Register User
exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Encrypt password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            username,
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email using Sequelize
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            "your_jwt_secret",
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get All Users from the Database Table 
exports.getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users") // Replace with your actual table name
            .select("*"); // Fetch all columns

        if (error) return res.status(400).json({ message: error.message });

        res.json({ users: data });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// ✅ Get Logged-in User Data
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find user by ID
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });

        // Check if user is found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user details
        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

