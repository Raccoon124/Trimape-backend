const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware'); // Middleware de autenticación
const bcrypt = require('bcrypt');

// GET: Obtener todos los usuarios (protegido)
router.get('/', authenticateToken, (req, res) => {
    db.query('CALL sp_get_users(NULL)', [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al obtener los usuarios.' });
        }
        res.status(200).json(results[0]); // Los resultados están en un array
    });
});

// GET: Obtener un usuario por ID (protegido)
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query('CALL sp_get_users(?)', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al obtener el usuario.' });
        }
        if (results[0].length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(200).json(results[0][0]);
    });
});

// POST: Crear un nuevo usuario (protegido)
router.post('/', authenticateToken, async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        // Generar un hash para la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('CALL sp_create_user(?, ?, ?, ?)', [name, email, hashedPassword, role], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.sqlMessage || 'Error al crear el usuario.' });
            }
            res.status(201).json({ message: 'Usuario creado exitosamente.' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

// PUT: Actualizar un usuario (protegido)
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!id || !name || !email || !role) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    db.query('CALL sp_update_user(?, ?, ?, ?)', [id, name, email, role], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al actualizar el usuario.' });
        }
        res.status(200).json({ message: 'Usuario actualizado correctamente.' });
    });
});

// DELETE: Eliminar un usuario (protegido)
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'El ID del usuario es obligatorio.' });
    }

    db.query('CALL sp_delete_user(?)', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.sqlMessage || 'Error al eliminar el usuario.' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    });
});

module.exports = router;
