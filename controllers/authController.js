const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const isMatch = await User.validatePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            userId: user.id,
            name: user.name,
            email: user.email,
            message: 'Inicio de sesión exitoso.',
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error en el servidor.' });
    }
};
