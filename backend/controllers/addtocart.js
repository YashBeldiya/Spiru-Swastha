const { Addtocart } = require("../models/addtocart")
const Product = require("../models/product")

const addtoCart = async(req,res) =>{
    try {
        const {userId,productId,variantId,quantity} = req.body
        const cart = await  Addtocart.findOne({user : userId})
        if(!cart) {
            await Addtocart.create({
                user : userId,
                items : [{
                    product : productId,
                    variant : variantId,
                    quantity
                }]
            })
            return res.status(200).json({
                success: true,
                message: "Cart created and item added successfully...!",
              });
        }

       const updated =  await Addtocart.findOneAndUpdate({
            user : userId,
            "items.product" : productId,
            "items.variant" : variantId
        },{$inc : {"items.$.quantity" : quantity}},{new : true})

        if(!updated) {
            await Addtocart.findOneAndUpdate({
                user : userId
            },{
                $push : {
                    items : {product : productId,variant : variantId,quantity}
                }
            },{new : true})
            return res.status(200).json({success : true,message : "New item added to cart...!"})
        }

        res.status(200).json({
            success: true,
            message: "Item quantity updated...!"
          });
    } catch (error) {
        return res.status(500).json({success : false,message : error.message})
    }
}

const removetoCart = async(req,res) => {
    try {
        const {userId , productId,variantId} = req.body
        const existingCart = await Addtocart.findOneAndUpdate({user : userId},{
            $pull : {
                items : {
                    product : productId,
                    variant : variantId
                }
            }
        },{new : true}) 

        if(!existingCart) return res.status(404).json({success : false,message : "Cart not Found...!!"})

        if(existingCart.items.length === 0 ){
            await Addtocart.deleteOne({user : userId})
            return res.status(200).json({
                success: true,
                message: "Item removed and cart deleted successfully...!"
              });
        }

        return res.status(200).json({
            success: true,
            message: "Item removed from cart"
          });
    } catch (error) {
        return res.status(500).json({success : false,message : error.message})
    }
}


const updateCartQuantity = async (req, res) => {
    try {
        const { userId, productId, variantId, quantity } = req.body;

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
        }

        // Step 1: Fetch the product and check if variant exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const variant = product.variants.find(v => v._id.toString() === variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        // Step 2: Check if requested quantity is within stock
        if (quantity > variant.stockAvailability) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stockAvailability} units available in stock for this variant.`,
            });
        }

        // Step 3: Check if cart exists and update quantity
        const existingCart = await Addtocart.findOne({ user: userId });
        if (!existingCart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = existingCart.items.find(
            (item) =>
                item.product.toString() === productId &&
                item.variant.toString() === variantId
        );

        if (!item) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        // Step 4: Update quantity
        const updatedCart = await Addtocart.findOneAndUpdate(
            {
                user: userId,
                "items.product": productId,
                "items.variant": variantId,
            },
            {
                $set: { "items.$.quantity": quantity },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully!",
            data: updatedCart,
        });
    } catch (error) {
        console.error('Update quantity error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};



const getCart = async (req,res) => {
    try {
        const cart = await Addtocart.findOne({user : req.params.userId}).populate('user').populate('items.product','productName category sku stock variants')
        if(!cart) return res.status(404).json({success : false,message : "Cart not Found...!!"})

        const newCartData = {
            _id : cart._id,
            userName : cart.user.name,
            email : cart.user.email,
            phone : cart.user.phone,
            items : cart.items.map((item) => ({
                _id:item.product._id,
                productName : item.product.productName,
                category : item.product.category,
                stock : item.product.stock,
                variant : item.product.variants.find((v) => v._id.toString() === item.variant.toString()),
                quantity: item.quantity
            })),
            createdAt : cart.createdAt,
            updatedAt : cart.updatedAt
        }

        return res.status(200).json({
            success : true,
            data : newCartData,
            message : "Cart get successfully..!"
        })
    } catch (error) {
        return res.status(500).json({success : false,message : error.message})
        
    }
}

const deleteCart = async (req,res) => {
    try {
        const userId = req.params.userId;
        await Addtocart.findOneAndDelete({ user : userId });
        res.status(200).json({ message: 'Cart cleared successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to clear cart', error: error.message });
      }
}

module.exports = {addtoCart,removetoCart,updateCartQuantity,getCart,deleteCart}