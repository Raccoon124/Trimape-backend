const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const userController = require('../controllers/userController');

router.get('/', authenticateToken, userController.getUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.post('/', authenticateToken, userController.createUser);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.put('/profile', authenticateToken, upload.single('profilePicture'), userController.updateProfile);
router.put('/change-password', authenticateToken, userController.changePassword);

module.exports = router;
