const Address = require('../models/address');
const mongoose = require('mongoose');

// GET: Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addressDoc = await Address.findOne({ userId });
    return res.status(200).json({
      success: true,
      addresses: addressDoc ? addressDoc.addresses : []
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST: Add a new address
const addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (address.isDefault) {
      await Address.updateOne(
        { userId },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    const result = await Address.findOneAndUpdate(
      { userId },
      { $push: { addresses: address } },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: result.addresses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Update an address by ID
const updateAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;
    const { addressId } = req.params;

    // Unset other defaults if setting a new one
    if (address.isDefault) {
      await Address.updateOne(
        { userId },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    const result = await Address.findOneAndUpdate(
      { userId, "addresses._id": addressId },
      {
        $set: {
          "addresses.$.fullName": address.fullName,
          "addresses.$.address": address.address,
          "addresses.$.address2": address.address2,
          "addresses.$.phone": address.phone,
          "addresses.$.pincode": address.pincode,
          "addresses.$.country": address.country,
          "addresses.$.state": address.state,
          "addresses.$.city": address.city,
          "addresses.$.isDefault": address.isDefault || false
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: result.addresses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE: Delete an address by ID
const deleteAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const { addressId } = req.params;

    const result = await Address.findOneAndUpdate(
      { userId },
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: result.addresses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Set default address
const setDefaultAddress = async (req, res) => {
    try {
      const { userId, addressId } = req.params;
  
      // First, unset all default addresses
      await Address.updateOne(
        { userId },
        { $set: { "addresses.$[].isDefault": false } }
      );
  
      // Then, set the specified address as default
      const result = await Address.findOneAndUpdate(
        { userId, "addresses._id": addressId },
        { $set: { "addresses.$.isDefault": true } },
        { new: true }
      );
  
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Address not found"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Default address set successfully",
        addresses: result.addresses
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

// GET: Find address document by userId (full document)
const findAddressDocumentByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const addressDoc = await Address.findOne({ userId });
  
      if (!addressDoc) {
        return res.status(404).json({ success: false, message: "No address found for this user" });
      }
  
      return res.status(200).json({
        success: true,
        data: addressDoc
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  

  module.exports = {getUserAddresses,setDefaultAddress,findAddressDocumentByUserId,deleteAddress,updateAddress,addAddress}