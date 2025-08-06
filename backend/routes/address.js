const { getUserAddresses, addAddress, updateAddress, deleteAddress, findAddressDocumentByUserId, setDefaultAddress } = require('../controllers/address')

const router = require('express').Router()

router.get('/get',getUserAddresses)
router.post('/add',addAddress)
router.put('/update/:userId/:addressId',updateAddress)
router.put('/default/:userId/:addressId',setDefaultAddress)
router.delete('/delete/:userId/:addressId',deleteAddress)
router.get('/get/:userId',findAddressDocumentByUserId)

module.exports = router