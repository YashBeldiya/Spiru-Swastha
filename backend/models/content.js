const mongoose = require('mongoose')

const ContentSchema = new  mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    description : 
        {
            type : String
        }
    ,
    benefits : [
        {
            title : {
                type : String,
            },
            desc : {
                type : String
            }
        }
    ],
    howtoUse:[
        {
            step:{
                type:String
            },
            desc:{
                type:String
            }
        }
    ],
    faqs : [
        {
            que:{
                type:String
            },
            ans :{
                type:String
            }
        }
    ]
},{timestamps:true})

const Content = mongoose.model('Content',ContentSchema)

module.exports = Content