const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro de archivos para imágenes
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

// Debug: Middleware para rastrear las rutas solicitadas
router.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.originalUrl}`);
    next();
});

// PUT: Actualizar perfil del usuario (específico)
router.put('/profile', authenticateToken, upload.single('profilePicture'), (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const userId = req.user.id;
    const { name, email } = req.body;
    const profilePicture = req.file ? req.file.path : null;

    if (!name || !email) {
        return res.status(400).json({ error: 'El nombre y el correo son obligatorios.' });
    }

    db.query('CALL sp_update_user_profile(?, ?, ?, ?)', [userId, name, email, profilePicture], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al actualizar el perfil.' });
        }
        res.status(200).json({ message: 'Perfil actualizado correctamente.' });
    });
});

// PUT: Cambiar contraseña
router.put('/change-password', authenticateToken, async (req, res) => {
    const userId = req.user.id; // ID del usuario autenticado
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Ambas contraseñas son obligatorias.' });
    }

    try {
        // Obtener la contraseña actual del usuario
        db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
            if (err) {
                console.error('Error al obtener la contraseña actual:', err);
                return res.status(500).json({ error: 'Error al verificar la contraseña actual.' });
            }

            // Verificar si el usuario existe
            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const hashedPassword = results[0].password;

            // Validar la contraseña actual
            const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
            }

            // Generar el hash de la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash(newPassword, salt);

            // Llamar al procedimiento almacenado para actualizar la contraseña
            db.query('CALL sp_change_password(?, ?)', [userId, newHashedPassword], (err) => {
                if (err) {
                    console.error('Error al cambiar la contraseña:', err);
                    return res.status(500).json({ error: 'Error al cambiar la contraseña.' });
                }

                res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
            });
        });
    } catch (error) {
        console.error('Error interno del servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});



// GET: Obtener todos los usuarios (general)
router.get('/', authenticateToken, (req, res) => {
    db.query('CALL sp_get_users(NULL)', [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al obtener los usuarios.' });
        }
        res.status(200).json(results[0]);
    });
});

// GET: Obtener un usuario por ID (general)
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query('CALL sp_get_users(?)', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al obtener el usuario.' });
        }
        if (results[0].length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Base URL del servidor
        const baseURL = 'https://localhost:3000';

        // Agregar URL completa a la imagen si existe
        const user = results[0][0];
        user.profile_picture = user.profile_picture
            ? `${baseURL}/${user.profile_picture.replace(/\\/g, '/')}`
            : null;

        res.status(200).json(user);
    });
});

// POST: Crear un nuevo usuario (general)
router.post('/', authenticateToken, async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('CALL sp_create_user(?, ?, ?, ?)', [name, email, hashedPassword, role], (err) => {
            if (err) {
                return res.status(500).json({ error: err.sqlMessage || 'Error al crear el usuario.' });
            }
            res.status(201).json({ message: 'Usuario creado exitosamente.' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

// PUT: Actualizar un usuario (general)
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!id || !name || !email || !role) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    db.query('CALL sp_update_user(?, ?, ?, ?)', [id, name, email, role], (err) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al actualizar el usuario.' });
        }
        res.status(200).json({ message: 'Usuario actualizado correctamente.' });
    });
});

// DELETE: Eliminar un usuario (general)
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'El ID del usuario es obligatorio.' });
    }

    db.query('CALL sp_delete_user(?)', [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al eliminar el usuario.' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    });
});

module.exports = router;
