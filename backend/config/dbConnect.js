const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yashbeladiya0306:Yash%402004@cluster0.ohreqxz.mongodb.net/SpiruSwastha')
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error", err.message);
  });

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/SpiruSwastha");
    console.log("✅ MongoDB Local Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/SpiruSwastha", {
//       serverSelectionTimeoutMS: 5000
//     });
//     console.log("✅ MongoDB Local Connected");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

