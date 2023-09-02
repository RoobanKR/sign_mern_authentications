const { validationResult } = require("express-validator");
const CategoryModel = require("../models/AdminModal"); // Import the CategoryModel, make sure the path is correct
const mongoose = require("mongoose");

// Create a new admin name (category)
const createCategory = async (req, res) => {
  const { category } = req.body;

  // Validate incoming data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create a new admin name (category) using the CategoryModel
    const newCategory = await CategoryModel.create({ category });
    res.status(201).json(newCategory); // Return the created admin name (category)
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get a list of all admin names (categories)
const getCategory = async (req, res) => {
  try {
    // Find and retrieve all admin names (categories) from the CategoryModel
    const categories = await CategoryModel.find({});
    res.status(200).json(categories); // Return the list of admin names (categories)
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get a single admin name (category) by its ID
const getSingleCategory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Admin Name (Category) Not Found" });
  }
  try {
    // Find a single admin name (category) by its ID using the CategoryModel
    const singleCategory = await CategoryModel.findById(id);
    if (!singleCategory) {
      return res.status(404).json({ error: "Admin Name (Category) Not Found" });
    }
    res.status(200).json(singleCategory); // Return the found admin name (category)
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Update an admin name (category) by its ID
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  // Validate incoming data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Admin Name (Category) Not Found" });
  }

  try {
    // Update an admin name (category) by its ID using the CategoryModel
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { category },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Admin Name (Category) Not Found" });
    }

    res.status(200).json(updatedCategory); // Return the updated admin name (category)
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Delete an admin name (category) by its ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Admin Name (Category) Not Found" });
  }

  try {
    // Delete an admin name (category) by its ID using the CategoryModel
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Admin Name (Category) Not Found" });
    }

    res.status(200).json({ message: "Admin Name (Category) deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  createCategory,
  getCategory,
  getSingleCategory,
  updateCategory, // Export the function for updating admin names (categories)
  deleteCategory,
};