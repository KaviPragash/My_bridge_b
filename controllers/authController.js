const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

console.log("Google:",process.env.GOOGLE_CLIENT_ID)


exports.googleAuth = async (req, res) => {
    const { code } = req.query;

    try {
      // Step 1: Exchange the authorization code for tokens
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      });
  
      const { access_token, id_token } = data;
  
      // Step 2: Fetch user info from Google
      const { data: userInfo } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      // Step 3: Check if the user already exists in the database
      let user = await User.findOne({ where: { email: userInfo.email } });
  
      if (!user) {
        // If the user doesn't exist, create a new user (Sign-In)
        user = await User.create({
          email: userInfo.email,
          username: userInfo.name, // Use Google's name as the username
          provider: "google", // Mark the user as a Google OAuth user
          providerId: userInfo.id, // Google's unique ID for the user
          avatarUrl: userInfo.picture, // Google's profile picture URL
        });
      } else if (user.provider !== "google") {
        // If the user exists but signed up with a different provider (e.g., email/password)
        return res.status(400).json({ message: "User already exists with a different provider" });
      }
  
      // Step 4: Generate a JWT token for the user
      const token = jwt.sign({ id: user.id }, "JWT_SECRET", { expiresIn: "1h" });
  
      // Step 5: Send the token and user ID in the response
      res.redirect(
        `http://localhost:3000?token=${token}&userId=${user.id}&email=${user.email}&username=${user.username}`
      );
    } catch (error) {
      console.error("Google OAuth error:", error.response ? error.response.data : error.message);
      res.status(500).json({ message: "Authentication failed" });
    }
  };

// ✅ Register User
exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare user data
        const userData = {
            email,
            password: hashedPassword,
            username,
        };

        // Create the user
        const user = await User.create(userData);

        // Return success response
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Validation Error Details:", error.errors); // Log validation errors
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

exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users using Sequelize's findAll method
        const users = await User.findAll({
            attributes: [
                "id",
                "email",
                "username"
            ]
        });

        // If no users are found, return a 404 response
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Return the list of users
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
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


exports.updateUser = async (req,res) => {
    try {
        const { id } = req.params; // Get user ID from URL params
        const { email, username, password } = req.body; // Get user details from request body

        // Find user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare update data
        const updateData = {};
        if (email) updateData.email = email;
        if (username) updateData.username = username;

        // If a new password is provided, hash it before updating
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Update user
        await user.update(updateData);

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

exports.DeleteUser = async (req, res) => {
    try{
        const { id } = req.params;

        const user = await User.findOne({ where: { id: id } });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        await User.destroy({where: {id: id}});
        return res.status(200).json({ message: "User deleted successfully" });
    }
    catch(error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
