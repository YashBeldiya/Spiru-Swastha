const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    count : {
        type : Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5']
    },
    title : {
        type:String
    },
    content : {
        type : String
    },
    displayName : {
        type : String,
    },
    email : {
        type : String
    },
    isApprove : {
        type : Boolean,
        default : false
    },
    status : {
        type : String,
        enum : ['pending','Approved','Rejected'],
        default : 'pending'
    }
},{timestamps : true,versionKey:false})

const Review = mongoose.model('Review',reviewSchema)

module.exports = Review