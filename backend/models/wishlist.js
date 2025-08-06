const mongoose = require('mongoose')

const WhishlistSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        }
    ]
},{timestamps:true})

const Whishlist = mongoose.model('Whishlist',WhishlistSchema)

module.exports = Whishlist