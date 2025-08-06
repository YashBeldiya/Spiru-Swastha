const mongoose = require('mongoose')

const AddtocartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    items : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            },
            variant : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            },
            quantity : {
                type : Number,
                default : 1,
                min : 1
            }
        }
    ]
},{timestamps:true})

const Addtocart = mongoose.model('Addtocart',AddtocartSchema)

module.exports = {Addtocart}