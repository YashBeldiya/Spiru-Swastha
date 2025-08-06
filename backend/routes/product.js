const { createProduct, getAllProduct, getProduct, deleteProduct, updateProduct, getNewLaunches, getBestSellers } = require('../controllers/product')
const router = require('express').Router()


  
router.get('/get-all',getAllProduct)
router.get('/get/:id',getProduct)
router.post('/create',createProduct)
router.post('/update/:id',updateProduct)
router.delete('/delete/:id',deleteProduct)
router.get('/new-launch',getNewLaunches)
router.get('/best-seller',getBestSellers)

module.exports = router