const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name : {
        type : String,
    },
    categoryImage : {
        type : String,
    },
    icon : {
        type : String,
    },
    slug : {
        type : String,
    },
    isActive : {
        type : Boolean,
        default : true
    }

},{timestamps : true})

const Category = mongoose.model('Category',CategorySchema)

module.exports = {Category}