const { addtoCart, removetoCart, updateCartQuantity, getCart, deleteCart } = require('../controllers/addtocart')


const router = require('express').Router()

router.post('/add',addtoCart)
router.post('/remove',removetoCart)
router.post('/update-quantity',updateCartQuantity)
router.get('/get/:userId',getCart)
router.delete('/clear/:userId',deleteCart)

module.exports = router