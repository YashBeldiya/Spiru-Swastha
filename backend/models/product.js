const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    productName : {
        type : String
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    slug : {
        type : String,
        lowercase: true,
    },
    type : {
        type : String,
        enum : ["Weight","Quantity"]
    },
    isfeatured : {
        type : Boolean,
        default : true
    },
    benefits : [
        {
            icon : {
                type : String,
                require : true
            },
            description : {
                type : String,
                require : true
            }
        }
    ],
    sku: {
        type: String,
        uppercase: true,
        trim: true,
        unique: true,
        sparse: true 
    },
    stock : {
        type : Number,
        default : 100
    },
    sellCount : {
        type : Number,

    },
    variants : [
        {
            attribute : {
                quantity : {
                    type : Number
                },
                label : {
                    type : String
                }
            },
            label : {
                type : String
            },
            sku: {
                type: String,
                uppercase: true,
                trim: true,
                unique: true,
                sparse: true 
            },
            productImage : [{
                type : String,
            }],
            originalPrice : {
                type : Number,
                required : true
            },
            discountPrice : {
                type : Number,
                required : true
            },
            discountPercent : {
                type : Number
            },
            stockAvailability : {
                type :Number,
            },
            isActive : {
                type : Boolean,
                default : true
            }
            
        }
    ],
    productVideo : [{
        type : String,
    }],
    isActive : {
        type : Boolean,
        default : true
    },
    certifications : {
        fssai: { 
            type: Boolean, 
            default: true
        },
        iso: { 
            type: Boolean, 
            default: true 
        },
        gmp: { 
            type: Boolean, 
            default: true 
        },
    },
    productContent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Description"
    }

    
},{timestamps : true})

const Product = mongoose.model('Product',ProductSchema)

module.exports = Product