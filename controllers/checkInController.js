const CheckIn = require('../models/CheckIn');

exports.createCheckIn = async (req, res) => {
    const { latitude, longitude, service_order_id } = req.body;
    const photoPath = req.file ? req.file.path : null;

    if (!latitude || !longitude || !photoPath) {
        return res.status(400).json({ error: 'Latitude, longitude, and photo are required.' });
    }

    try {
        const check_in_id = await CheckIn.create(req.user.id, service_order_id, latitude, longitude, photoPath);
        res.status(201).json({ message: 'Check-in registrado exitosamente.', check_in_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckIns = async (req, res) => {
    try {
        const checkIns = await CheckIn.getAll(req.user.id);
        res.status(200).json(checkIns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCheckInById = async (req, res) => {
    try {
        const checkIn = await CheckIn.getById(req.user.id, req.params.id);
        if (!checkIn) return res.status(404).json({ error: 'Check-in no encontrado.' });
        res.status(200).json(checkIn);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
