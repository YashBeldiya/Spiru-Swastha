const { createReview, getAllReviews, getReviewById, updateReview, deleteReview, updateReviewStatus, getReviewsByProduct, getTopReviewedProducts } = require('../controllers/review')

const router = require('express').Router()

router.post('/create',createReview)
router.get('/getall',getAllReviews)
router.get('/get/:productId',getReviewsByProduct)
router.get('/get-one/:id',getReviewById)
router.post('/update/:id',updateReview)
router.post('/update-status/:id',updateReviewStatus)
router.delete('/delete/:id',deleteReview)
router.get('/top-rated',getTopReviewedProducts)

module.exports = router