const { addToWhishlist, removeWhishlist, getWhishlist } = require('../controllers/whishlist')

const router = require('express').Router()

router.post('/add',addToWhishlist)
router.post('/remove',removeWhishlist)
router.get('/get/:userId',getWhishlist)

module.exports = router