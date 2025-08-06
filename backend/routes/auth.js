const {registerUser, LoginUser, verifyEmail, verifyOtp, resetPassword, userProfile, changePassword, LoginAdmin, getAllUsers, updateUser, deleteUser, updateProfile } = require('../controllers/auth');

const router = require('express').Router()
const authorization = require('../middlewares/authorization');
const validationReq = require('../utils/validationAsync')

router.post('/register',registerUser);
router.post('/login',LoginUser);
router.post('/admin-login',LoginAdmin);
router.post('/email-verify',authorization(['Admin','User']),verifyEmail);
router.put('/otp-verify',validationReq("verifyOtpValidation"),verifyOtp);
router.put('/reset-password',authorization(['Admin','User']),resetPassword);
router.get('/profile',authorization(['Admin','User']),userProfile);
router.post('/change-password',authorization(['Admin','User']),validationReq("changePasswordValidation"),changePassword);
router.get('/users', getAllUsers); // Fetch all users (admin only)
router.put('/users/:id', updateUser); // Update a user (admin only)
router.put('/profile',updateProfile)
router.delete('/users/:id', deleteUser);

module.exports = router