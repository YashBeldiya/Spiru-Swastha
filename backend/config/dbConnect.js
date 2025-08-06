const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/SpiruSwastha')
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error", err.message);
  });
