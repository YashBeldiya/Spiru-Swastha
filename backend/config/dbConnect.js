const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yashbeladiya0306:Yash%402004@cluster0.ohreqxz.mongodb.net/SpiruSwastha')
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error", err.message);
  });
