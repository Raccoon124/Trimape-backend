const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuración para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed.'));
        }
    }
});

// POST: Registrar un check-in
router.post('/', authenticateToken, upload.single('photo'), (req, res) => {
    const { latitude, longitude, service_order_id } = req.body;
    const photoPath = req.file ? req.file.path : null;

    // Validaciones iniciales
    if (!latitude || !longitude || !photoPath) {
        console.error('Datos incompletos:', { latitude, longitude, photoPath });
        return res.status(400).json({ error: 'Latitude, longitude, and photo are required.' });
    }

    console.log('Datos recibidos para el check-in:', {
        user_id: req.user.id,
        latitude,
        longitude,
        service_order_id,
        photoPath
    });

    // Llamada al procedimiento almacenado
    db.query(
        'CALL sp_create_check_in(?, ?, ?, ?, ?)',
        [req.user.id, service_order_id || null, latitude, longitude, photoPath],
        (err, results) => {
            if (err) {
                console.error('Error al registrar el check-in en la base de datos:', err);
                return res.status(500).json({ error: err.sqlMessage || 'Error al registrar el check-in.' });
            }

            console.log('Check-in registrado correctamente:', results);
            res.status(201).json({
                message: 'Check-in registrado exitosamente.',
                check_in_id: results[0].insertId
            });
        }
    );
});

// GET: Obtener todos los check-ins
router.get('/', authenticateToken, (req, res) => {
    db.query('CALL sp_get_check_ins(?, NULL, NULL)', [req.user.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al obtener los check-ins.' });
        }
        res.status(200).json(results[0]); // Los resultados están en un array
    });
});

// GET: Obtener un check-in específico
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query('CALL sp_get_check_ins(?, NULL, ?)', [req.user.id, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al obtener el check-in.' });
        }
        if (results[0].length === 0) {
            return res.status(404).json({ error: 'Check-in no encontrado.' });
        }
        res.status(200).json(results[0][0]);
    });
});

module.exports = router;
