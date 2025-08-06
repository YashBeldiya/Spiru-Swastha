const Content = require("../models/content");
const Product = require("../models/product");

const createContent = async(req,res) =>{
    try {
        const { productId, description, benefits, howtoUse, faqs, status } = req.body;
        
        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(400).json({ message: 'Product not found' });
        }
        
        // Create new content using create() instead of save()
        const newContent = await Content.create({
          productId,
          description,
          benefits: benefits || [],
          howtoUse: howtoUse || [],
          faqs: faqs || [],
          status: status || 'Draft'
        });
        
       return res.status(201).json({success : true,data : newContent,message : "Content created successfully...!"});
      } catch (err) {
        return res.status(500).json({success : false, message: err.message });
      }
}

// const getAllContent = async(req,res) => {
//     try {
//         const content = await Content.aggregate(
//           [
//             {
//               $lookup: {
//                 from: "products",
//                 localField: "productId",
//                 foreignField: "_id",
//                 as: "product",
//                 pipeline : [
//                   {
//                     $project : {
//                       productName : 1,
//                       variants : 1,
//                       _id:0
//                     }
//                   },
//                 ]
//               }
//             },
//             {
//               $unwind: {
//                 path: "$product",
//                 preserveNullAndEmptyArrays: true
//               }
//             },
//             {
//               $unwind: {
//                 path: "$product.variants",
//                 preserveNullAndEmptyArrays: true
//               }
//             },
//             {
//               $project: {
//                 "productName": "$product.productName",
//                 "productId" : "$productId",
//                 "productImage" : "$product.variants.productImage",
//                 "benefits" : "$benefits",
//                 "description" : "$description",
//                 "faqs" : "$faqs",
//                 "howtoUse" : "$howtoUse"
//               }
//             }
//           ]
//         )
//         return res.status(200).json({success : true,data : content,message : "All Content get successfully...!"});

//       } catch (err) {
//         return res.status(500).json({ success : false,message: err.message });

//       }
// }

const getAllContent = async (req, res) => {
  try {
    const content = await Content.aggregate([
      {
        $lookup: {
          from: 'products', // Matches the collection name (lowercase plural of 'Products')
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          productId: 1,
          productName: '$product.productName',
          productImage: {
            $arrayElemAt: ['$product.variants.productImage', 0], // Get first image from first variant
          },
          description: 1,
          benefits: 1,
          howtoUse: 1,
          faqs: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    return res.status(200).json({ success: true, data: content, message: 'All Content retrieved successfully...!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getContent = async (req,res) => {
  try {
    const content = await Content.findById(req.params.id).populate('productId', 'name sku');
    if (!content) {
      return res.status(404).json({success : false, message: 'Content not found' });
    }
    return res.status(200).json({success : true,data : content,message : "Content get successfully...!"});
    
  } catch (err) {
    return res.status(500).json({ success : false,message: err.message });

  }
}

const updateContent = async (req,res) => {
  try {
    const { productId, description, benefits, howtoUse, faqs, status } = req.body;
    
    // Validate product exists if productId is being updated
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
    }
    
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        productId,
        description,
        benefits,
        howtoUse,
        faqs,
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true } // Added runValidators to ensure schema validation
    );
    
    if (!updatedContent) {
      return res.status(404).json({success : false, message: 'Content not found' });
    }
    
    return res.status(200).json({success : true,data : updatedContent,message : "Content updated successfully...!"});
  } catch (err) {
    return res.status(500).json({ success : false,message: err.message });
  }
}

const deleteContent = async (req,res) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);
    if (!deletedContent) {
      return res.status(404).json({success : false, message: 'Content not found' });
    }
    return res.status(200).json({success : true,message : "Content deleted successfully...!"});

  } catch (err) {
    return res.status(500).json({ success : false,message: err.message });
  }
}

const getContentByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const content = await Content.findOne({ productId }).populate('productId', 'productName sku');
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found for this product' });
    }
    return res.status(200).json({ success: true, data: content, message: 'Content retrieved successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
module.exports = {createContent,getAllContent,getContent,updateContent,deleteContent,getContentByProductId}