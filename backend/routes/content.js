const { createContent, getAllContent, getContent, updateContent, deleteContent, getContentByProductId } = require('../controllers/content')

const router = require('express').Router()

router.post('/create',createContent)
router.get('/getall',getAllContent)
router.get('/get/:id',getContent)
router.get('/product/:productId', getContentByProductId);
router.post('/update/:id',updateContent)
router.delete('/delete/:id',deleteContent)

module.exports = router