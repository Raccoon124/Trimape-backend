const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Middleware para manejar imágenes
const checkInController = require('../controllers/checkInController');

router.post('/', authenticateToken, upload.single('photo'), checkInController.createCheckIn);
router.get('/', authenticateToken, checkInController.getCheckIns);
router.get('/:id', authenticateToken, checkInController.getCheckInById);

module.exports = router;
