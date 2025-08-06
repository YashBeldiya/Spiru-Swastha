// const { default: mongoose } = require("mongoose");
// const Order = require("../models/order");
// const Product = require("../models/product");

// const createOrder = async (req, res) => {
//   try {
//     const { userId, items, totalAmount, address } = req.body;

//     if (!userId || !items || items.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     const order = await Order.create({
//       userId,
//       items,
//       totalAmount,
//       address,
//       status: "Approved",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: order,
//     });
//   } catch (error) {
//     console.error("Order creation error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: "$user",
//       },
//       {
//         $unwind: "$items",
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "items.productId",
//           foreignField: "variants._id",
//           as: "product",
//         },
//       },
//       {
//         $unwind: "$product",
//       },
//       {
//         $addFields: {
//           "items.productDetail": {
//             $arrayElemAt: [
//               {
//                 $filter: {
//                   input: "$product.variants",
//                   as: "variant",
//                   cond: { $eq: ["$$variant._id", "$items.productId"] },
//                 },
//               },
//               0,
//             ],
//           },
//           "items.productName": "$product.productName",
//           "items.slug": "$product.slug",
//           "items.sku": "$product.sku",
//           "items.certifications": "$product.certifications",
//         },
//       },
//       {
//         $group: {
//           _id: "$_id",
//           user: { $first: "$user" },
//           items: { $push: "$items" },
//           totalAmount: { $first: "$totalAmount" },
//           status: { $first: "$status" },
//           address: { $first: "$address" },
//           orderDate: { $first: "$orderDate" },
//           createdAt: { $first: "$createdAt" },
//           updatedAt: { $first: "$updatedAt" },
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           totalAmount: 1,
//           status: 1,
//           address: 1,
//           orderDate: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           "user._id": 1,
//           "user.name": 1,
//           "user.lastName": 1,
//           "user.email": 1,
//           items: 1,
//         },
//       },
//     ]);

//     res.status(200).json({ success: true, data: orders });
//   } catch (error) {
//     console.error("Error getting orders:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const getOrdersByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const orders = await Order.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: "$user",
//       },
//       {
//         $unwind: "$items",
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "items.productId",
//           foreignField: "variants._id",
//           as: "product",
//         },
//       },
//       {
//         $unwind: "$product",
//       },
//       {
//         $addFields: {
//           "items.productDetail": {
//             $arrayElemAt: [
//               {
//                 $filter: {
//                   input: "$product.variants",
//                   as: "variant",
//                   cond: { $eq: ["$$variant._id", "$items.productId"] },
//                 },
//               },
//               0,
//             ],
//           },
//           "items.productName": "$product.productName",
//           "items.slug": "$product.slug",
//           "items.sku": "$product.sku",
//           "items.certifications": "$product.certifications",
//         },
//       },
//       {
//         $group: {
//           _id: "$_id",
//           user: { $first: "$user" },
//           items: { $push: "$items" },
//           totalAmount: { $first: "$totalAmount" },
//           status: { $first: "$status" },
//           address: { $first: "$address" },
//           orderDate: { $first: "$orderDate" },
//           createdAt: { $first: "$createdAt" },
//           updatedAt: { $first: "$updatedAt" },
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           totalAmount: 1,
//           status: 1,
//           address: 1,
//           orderDate: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           "user._id": 1,
//           "user.name": 1,
//           "user.lastName": 1,
//           "user.email": 1,
//           items: 1,
//         },
//       },
//       {
//         $sort: { createdAt: -1 },
//       },
//     ]);

//     res.status(200).json({ success: true, data: orders });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     if (!["Dispatch", "Approved", "Out Of Delivery", "Cancelled"].includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status value" });
//     }

//     const updated = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.status(200).json({ success: true, message: "Status updated", data: updated });
//   } catch (error) {
//     console.error("Status update error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// const deleteOrderByAdmin = async (req, res) => {
//   try {
//     if (!req.user?.isAdmin) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     const deleted = await Order.findByIdAndDelete(req.params.orderId);

//     if (!deleted) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   createOrder,
//   getAllOrders,
//   getOrdersByUserId,
//   updateOrderStatus,
//   deleteOrderByAdmin,
// };

const { default: mongoose } = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, address } = req.body;

    // Validate required fields
    if (!userId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validate items array for productId and quantity
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid productId or quantity in items" });
      }
    }

    // Validate that product IDs exist
    for (const item of items) {
      const product = await Product.findOne({ "variants._id": item.productId });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product not found for variant ${item.productId}` });
      }
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      address,
      status: "Approved",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "variants._id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $addFields: {
          "items.productDetail": {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$product.variants",
                  as: "variant",
                  cond: { $eq: ["$$variant._id", "$items.productId"] },
                },
              },
              0,
            ],
          },
          "items.productName": "$product.productName",
          "items.slug": "$product.slug",
          "items.sku": "$product.sku",
          "items.certifications": "$product.certifications",
          "items.quantity": "$items.quantity",
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          items: { $push: "$items" },
          totalAmount: { $first: "$totalAmount" },
          status: { $first: "$status" },
          address: { $first: "$address" },
          orderDate: { $first: "$orderDate" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          status: 1,
          address: 1,
          orderDate: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.lastName": 1,
          "user.email": 1,
          items: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "variants._id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $addFields: {
          "items.productDetail": {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$product.variants",
                  as: "variant",
                  cond: { $eq: ["$$variant._id", "$items.productId"] },
                },
              },
              0,
            ],
          },
          "items.productName": "$product.productName",
          "items.slug": "$product.slug",
          "items.sku": "$product.sku",
          "items.certifications": "$product.certifications",
          "items.quantity": "$items.quantity",
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          items: { $push: "$items" },
          totalAmount: { $first: "$totalAmount" },
          status: { $first: "$status" },
          address: { $first: "$address" },
          orderDate: { $first: "$orderDate" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          status: 1,
          address: 1,
          orderDate: 1,
          createdAt: 1,
          updatedAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.lastName": 1,
          "user.email": 1,
          items: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Dispatch", "Approved", "Out Of Delivery", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // If transitioning to "Out Of Delivery" from another status
    if (status === "Out Of Delivery" && order.status !== "Out Of Delivery") {
      for (const item of order.items) {
        const variantId = new mongoose.Types.ObjectId(item.productId);

        const product = await Product.findOne({ "variants._id": variantId });

        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found for variant" });
        }

        const variantIndex = product.variants.findIndex(
          (v) => v._id.toString() === variantId.toString()
        );

        if (variantIndex === -1) {
          return res
            .status(404)
            .json({ success: false, message: "Variant not found" });
        }

        const variant = product.variants[variantIndex];
        const currentStock = variant.stockAvailability ?? 0;

        const quantity = Number(item.quantity);

        if (!item.quantity || isNaN(quantity) || quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid quantity (${item.quantity}) for variant ${variant._id}`,
          });
        }

        if (currentStock < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for variant ${
              variant.label || variant._id
            }`,
          });
        }

        // Update stock using dot notation
        const updateField = {};
        updateField[`variants.${variantIndex}.stockAvailability`] = currentStock - quantity;

        await Product.updateOne(
          { "variants._id": variantId },
          { $set: updateField }
        );
      }
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteOrderByAdmin = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const deleted = await Order.findByIdAndDelete(req.params.orderId);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrderByAdmin,
};