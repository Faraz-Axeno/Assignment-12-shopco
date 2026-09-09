const express = require('express');
const router = express.Router();
const { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.route('/').get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;
