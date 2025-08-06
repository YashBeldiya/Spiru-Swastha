const Product = require("../models/product");

// Get all products
const getAllProduct = async(req, res) => {
  try {
    const AllProducts = await Product.find().populate('category', 'name slug',).populate('productContent');
    return res.status(200).json({ 
      success: true,
      data: AllProducts,
      message: "All Products retrieved successfully!" 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// Get single product by ID
const getProduct = async(req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('productContent');
      
    if(!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!"
      });
    }
     
    return res.status(200).json({
      success: true,
      data: product,
      message: "Product retrieved successfully!"
    });
    
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      slug,
      type,
      sku,
      stock,
      benefits,
      variants,
      productVideo,
      certifications,
      productContent,
      isActive,
      isfeatured,
      sellCount
    } = req.body;

    // Validate required fields
    if (!productName || !category || !type || !sku) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (productName, category, type, sku)"
      });
    }

    // Validate variants
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one variant is required"
      });
    }

    // Validate each variant
    for (const variant of variants) {
      if (!variant.originalPrice || !variant.discountPrice) {
        return res.status(400).json({
          success: false,
          message: "Each variant must have originalPrice and discountPrice"
        });
      }
    }

    // Create product payload
    const payload = {
      productName,
      category,
      slug: slug || productName.toLowerCase().replace(/\s+/g, '-'),
      type,
      sku: sku.toUpperCase(),
      stock: stock || 100,
      benefits: benefits || [],
      variants: variants.map(v => ({
        ...v,
        sku: v.sku ? v.sku.toUpperCase() : `${sku.toUpperCase()}-${v.label || 'VAR'}`,
        productImage: v.productImage || []
      })),
      productVideo: productVideo || [],
      certifications: certifications || {
        fssai: true,
        iso: true,
        gmp: true
      },
      productContent,
      isActive: isActive !== undefined ? isActive : true,
      isfeatured: isfeatured !== undefined ? isfeatured : true,
      sellCount
    };

    // Create product
    const product = await Product.create(payload);
    
    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully!"
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "SKU must be unique",
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);
    
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found!" 
      });
    }

    const {
      productName,
      category,
      slug,
      type,
      sku,
      stock,
      benefits,
      variants,
      productVideo,
      certifications,
      productContent,
      isActive,
      isfeatured,
      sellCount
    } = req.body;

    // Prepare update payload
    const updatePayload = {
      productName,
      category,
      slug: slug || productName.toLowerCase().replace(/\s+/g, '-'),
      type,
      sku: sku ? sku.toUpperCase() : existingProduct.sku,
      stock: stock || existingProduct.stock,
      benefits: benefits || existingProduct.benefits,
      variants: variants ? variants.map(v => ({
        ...v,
        sku: v.sku ? v.sku.toUpperCase() : existingProduct.variants.find(vr => vr.label === v.label)?.sku || `${sku.toUpperCase()}-${v.label || 'VAR'}`,
        productImage: v.productImage || []
      })) : existingProduct.variants,
      productVideo: productVideo || existingProduct.productVideo,
      certifications: certifications || existingProduct.certifications,
      productContent: productContent || existingProduct.productContent,
      isActive: isActive !== undefined ? isActive : existingProduct.isActive,
      isfeatured: isfeatured !== undefined ? isfeatured : existingProduct.isfeatured,
      sellCount: sellCount || existingProduct.sellCount
    };

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatePayload,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('productContent');

    return res.status(200).json({ 
      success: true, 
      data: updatedProduct,
      message: "Product updated successfully!" 
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "SKU must be unique",
        error: error.message
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      error: error 
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);
    
    if(!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!"
      });
    }

    await Product.findByIdAndDelete(productId);
    
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// get newLaunches
const getNewLaunches = async (req, res) => {
  try {
    const newLaunches = await Product.aggregate([
      {
        $sort: { createdAt: -1 } // Sort by newest first
      },
      {
        $limit: 8 // Limit to first 8 products
      }
    ]);

    res.status(200).json({
      success: true,
      data: newLaunches,
    });
  } catch (error) {
    console.error("Error fetching new launches:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.aggregate([
      {
        $match: {
          sellCount: { $gt: 0 } 
        }
      },
      {
        $sort: { sellCount: -1 } 
      },
      {
        $limit: 8 
      }
    ]);

   return res.status(200).json({
      success: true,
      data: bestSellers,
    });
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { 
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getNewLaunches,
  getBestSellers
};