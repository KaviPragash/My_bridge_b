const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const { googleAuth } = require("../controllers/authController")
// Authcontroller Routes
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  DeleteUser
} = require("../controllers/authController");

const {
  add_course,
  GetCoursedetails,
  GetCourseById,
  updateCourse,
  deleteCourse,
  GetCourseBYSP,
} = require("../controllers/course");

// Admin_authController Routes
const {
  Adminlogin,
  admin_register,
  Admin_getUserById,
  add_category,
  get_all_categories,
  add_location,
  get_all_location,
  add_language,
  get_all_language,
  institute_type,
  get_all_InstituteType,
} = require("../controllers/admin");

// Institute_authController Routes
const {
  add_institute,
  GetInstituteDetails,
  GetInstituteById,
  updateInstitute,
  deleteInstitute,
  GetInstituteBYSP,
} = require("../controllers/institute");

// Expert Auth Routs
const {
  add_expert,
  GetExpertById,
  GetExpertDetails,
  updateExpert,
  deleteExpert,
  GetExpertssBYSP,
} = require("../controllers/expert");

const {
  ServiceProvider_Register,
  ServiceProvider_login,
  AllServiceProviders,
  ServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider
} = require("../controllers/ServiceProvider");

const uploadImage = require("../controllers/img");

const router = express.Router();

// Google OAuth routes
router.get("/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.get('/google/callback', googleAuth);

// User Routes
router.post("/register", register);
router.post("/login", login);
router.get("/getAllUsers", getAllUsers);
router.get("/getUserById/:id", getUserById);
router.put("/updateUser/:id", updateUser);
router.delete("/DeleteUser/:id", DeleteUser);

// Admin User Routes
router.post("/admin_register", admin_register);
router.post("/admin_login", Adminlogin);
router.get("/Admin_getUserById/:id", Admin_getUserById);

// Service Provider Routes
router.post("/ServiceProvider_Register", ServiceProvider_Register);
router.post("/ServiceProvider_login", ServiceProvider_login);
router.get("/AllServiceProviders", AllServiceProviders);
router.get("/ServiceProviderById/:id", ServiceProviderById);
router.put("/updateServiceProvider/:id", updateServiceProvider);
router.delete("/deleteServiceProvider/:id", deleteServiceProvider);

// Auth Check Route
router.get("/check", authMiddleware, (req, res) => {
  res.status(200).json({ message: "User is authenticated", user: req.user });
});

// Image Routes
router.post("/uploadImage", uploadImage);

// institute type routes
router.post("/institute_type", institute_type);
router.get("/get_all_InstituteType", get_all_InstituteType);

// Category Routes
router.post("/add_category", add_category);
router.get("/get_all_categories", get_all_categories);

// Location Routs
router.post("/add_location", add_location);
router.get("/get_all_location", get_all_location);

// Language Routs
router.post("/add_language", add_language);
router.get("/get_all_language", get_all_language);

// Course Page Routs
router.post("/add_course", add_course);
router.get("/GetCoursedetails", GetCoursedetails);
router.get("/GetCourseById/:id", GetCourseById);
router.put("/updateCourse/:id", updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);
router.get("/GetCourseBYSP", GetCourseBYSP);

// University page Routes
router.post("/add_institute", add_institute);
router.get("/GetInstituteDetails", GetInstituteDetails);
router.get("/GetInstituteById/:id", GetInstituteById);
router.put("/updateInstitute/:id", updateInstitute);
router.delete("/deleteInstitute/:id", deleteInstitute);
router.get("/GetInstituteBYSP", GetInstituteBYSP);

// Expert Page Routs
router.post("/add_expert", add_expert);
router.get("/GetExpertDetails", GetExpertDetails);
router.get("/GetExpertById/:id", GetExpertById);
router.put("/updateExpert/:id", updateExpert);
router.delete("/deleteExpert/:id", deleteExpert);
router.get("/GetExpertssBYSP", GetExpertssBYSP);

module.exports = router;
