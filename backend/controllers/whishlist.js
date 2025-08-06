const Whishlist = require("../models/wishlist")

const addToWhishlist = async (req,res) => {
    const {userId, productId} = req.body
    try {
        await Whishlist.updateOne({user : userId},{$addToSet : {products : productId}},{new : true,upsert:true})
        return res.status(200).json({success : true,message : "Add to whishlist successfully...!"})
    } catch (error) {
        return res.status(500).json({success : false,message : error.message})
    }
}

const removeWhishlist = async(req,res) => {
    const {userId,productId} = req.body
    try {
        const whishlist = await Whishlist.findOneAndUpdate({user : userId},{$pull:{products:productId}},{new:true})
        if(!whishlist) return res.status(400).json({success:false,message : "Whishlist not found...!"})
        if(whishlist.products.length === 0) {
            await Whishlist.deleteOne({_id : whishlist._id})
            return res.status(200).json({success : true,message : "Product removed and empty whishlist deleted...!"}) 
        }
        return res.status(200).json({success:true,message : "Product remove from whishlist...!"})
    } catch (error) {
        return res.status(500).json({success : false,message : error.message})
    }
}

const getWhishlist = async(req,res) => {
    try {
        const whishlist = await Whishlist.findOne({user : req.params.userId}).populate('products','productName category sku stock variants')
        if(!whishlist) return res.status(404).json({success:false,message : "Whishlist not found...!"})

        return res.status(200).json({success : true,data : whishlist,message:"Whishlist get successfully...!"})
    } catch (error) {
        return res.status(500).json({success : false,message : error.message})
    }
}
module.exports = {addToWhishlist,removeWhishlist,getWhishlist}