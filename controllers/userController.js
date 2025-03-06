const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.getById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
        
        user.profile_picture = user.profile_picture
            ? `https://localhost:3000/${user.profile_picture.replace(/\\/g, '/')}`
            : null;

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const response = await User.create(name, email, password, role);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const response = await User.update(req.params.id, req.body.name, req.body.email, req.body.role);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const response = await User.delete(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profilePicture = req.file ? req.file.path : null;
        const response = await User.updateProfile(req.user.id, req.body.name, req.body.email, profilePicture);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const response = await User.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
