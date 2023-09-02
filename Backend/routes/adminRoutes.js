const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createCategory,
  getCategory,
  getSingleCategory,
  updateCategory, // Add this import for updating category
  deleteCategory,
} = require("../controllers/AdminControllers"); // Make sure the path is correct

// Validate incoming data for createCategory route
const validateCategory = [
  body("category").notEmpty().withMessage("Category is required"),
];

router.post("/", validateCategory, createCategory);
router.get("/getadmin", getCategory);
router.get("/:id", getSingleCategory);
router.put("/update:id", updateCategory); // Update category by ID
router.delete("/delete:id", deleteCategory);

module.exports = router;