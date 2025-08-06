const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    addresses : [
        {
            fullName: {
                type: String,
                trim: true
              },
              address: {
                type: String,
                trim: true
              },
              address2: {
                type: String,
                trim: true
              },
              phone: {
                type: String,
                trim: true,
                match: /^[0-9]{10}$/
              },
              pincode: {
                type: String,
                trim: true,
                match: /^[0-9]{6}$/
              },
              country: {
                type: String,
                trim: true
              },
              state: {
                type: String,
                trim: true
              },
              city: {
                type: String,
                trim: true
              },
              isDefault: {
                type: Boolean,
                default: false
              }
        }
    ]
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address