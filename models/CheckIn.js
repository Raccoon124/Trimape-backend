const pool = require('../config/db');

class CheckIn {
    static async create(user_id, service_order_id, latitude, longitude, photoPath) {
        try {
            const [results] = await pool.query(
                'CALL sp_create_check_in(?, ?, ?, ?, ?)',
                [user_id, service_order_id || null, latitude, longitude, photoPath]
            );
            return results[0].insertId;
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al registrar el check-in.');
        }
    }

    static async getAll(user_id) {
        try {
            const [results] = await pool.query('CALL sp_get_check_ins(?, NULL, NULL)', [user_id]);
            return results[0];
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al obtener los check-ins.');
        }
    }

    static async getById(user_id, id) {
        try {
            const [results] = await pool.query('CALL sp_get_check_ins(?, NULL, ?)', [user_id, id]);
            return results[0].length > 0 ? results[0][0] : null;
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al obtener el check-in.');
        }
    }
}

module.exports = CheckIn;
