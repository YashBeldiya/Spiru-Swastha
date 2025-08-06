const Review = require('../models/review');

// Create a new review
const createReview = async (req, res) => {
  try {
    const {
      product,
      user,
      count,
      title,
      content,
      displayName,
      email,
    } = req.body;

    const newReview = await Review.create({
      product,
      user,
      count,
      title,
      content,
      displayName,
      email,
    });

    res.status(201).json({ success: true, review: newReview, message : "Review added successfully..!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all reviews with optional filters
const getAllReviews = async (req, res) => {
  try {
    const { status, isApprove, product } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (isApprove !== undefined) filter.isApprove = isApprove === 'true';
    if (product) filter.product = product;

    const reviews = await Review.aggregate(
        [
            {
              $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "product",
                pipeline : [
                  {$project : {
                    productName : 1,
                    _id :0
                  }}
                ]
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline : [
                  {
                    $project : {
                      name : 1,
                      _id: 0
                    }
                  }
                ]
              }
            },
            {
              $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                "productName": "$product.productName",
                "user" : "$user.name",
                "count" : "$count",
                "title" : "$title",
                "content":"$content",
                "displayName" : "$displayName",
                "email" : "$email",
                "isApprove" : "$isApprove",
                "status" : "$status",
                "createdAt":"$createdAt"
              }
            }
          ]
    )

    res.status(200).json({ success: true, data : reviews , message : "Get all reviews successfully...!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'productName')
      .populate('user', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, data : review ,message : "Review get successfully..!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review (admin or owner)
const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Approve or reject review
const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await Review.updateOne(
      { _id: req.params.id },
      { $set: { status, isApprove: status === 'Approved' } }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Review not found or already up to date' });
    }

    res.status(200).json({ success: true, message: 'Review status updated successfully..!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApprove: true
    })
      .populate('product', 'productName')
      .populate('user', 'name')
      .select('count title content displayName createdAt');

    res.status(200).json({ 
      success: true, 
      data: reviews, 
      message: "Reviews fetched successfully for the product!" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



const getTopReviewedProducts = async (req, res) => {
  try {
    const topReviewed = await Review.aggregate([
      {
        $match: {
          isApprove: true,
        },
      },
      {
        $group: {
          _id: "$product",
          reviewCount: { $sum: 1 },
        },
      },
      {
        $sort: { reviewCount: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          productName: "$product.productName",
          slug: "$product.slug",
          reviewCount: 1,
          variants: "$product.variants",
          benefits: "$product.benefits",
          productImage: {
            $arrayElemAt: ["$product.variants.productImage", 0]
          }
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: topReviewed,
      message: "Top 3 reviewed products fetched successfully!",
    });
  } catch (error) {
    console.error("Top Reviewed Product Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {createReview,deleteReview,updateReviewStatus,updateReview,getReviewById,getAllReviews,getReviewsByProduct,getTopReviewedProducts}
