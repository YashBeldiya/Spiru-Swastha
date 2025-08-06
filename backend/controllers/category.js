const { Category } = require("../models/category");

// GET ALL categories
const getallCategory = async (req, res) => {
  try {
    const allcategory = await Category.find({ isActive: true });
    return res.status(200).json({
      success: true,
      data: allcategory,
      message: "All Categories retrieved successfully!"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET single category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    return res.status(200).json({
      success: true,
      data: category,
      message: "Category retrieved successfully!"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE category
const createCategory = async (req, res) => {
  try {
    const { name, slug, isActive, categoryImage, icon } = req.body;

    // if (!name || !slug || !categoryImage) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: "Name, slug, and categoryImageUrl are required" 
    //   });
    // }

    const newCategory = await Category.create({
      name,
      slug,
      isActive: isActive || true,
      categoryImage,
      icon:icon || null
    });

    return res.status(201).json({ 
      success: true, 
      data: newCategory,
      message: "Category created successfully!" 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive, categoryImage, icon } = req.body;

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || existingCategory.name,
        slug: slug || existingCategory.slug,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive,
        categoryImageUrl: categoryImage || existingCategory.categoryImage,
        iconUrl: icon!== undefined ? icon : existingCategory.icon
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully!"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedCategory,
      message: "Category deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getCategory, 
  getallCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};