const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async getAll() {
        try {
            const [results] = await pool.query('CALL sp_get_users(NULL)');
            return results[0];
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al obtener los usuarios.');
        }
    }

    static async findByEmail(email) {
        try {
            const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al buscar usuario.');
        }
    }

    static async validatePassword(inputPassword, hashedPassword) {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }


    static async getById(id) {
        try {
            const [results] = await pool.query('CALL sp_get_users(?)', [id]);
            return results[0].length > 0 ? results[0][0] : null;
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al obtener el usuario.');
        }
    }

    static async create(name, email, password, role) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('CALL sp_create_user(?, ?, ?, ?)', [name, email, hashedPassword, role]);
            return { message: 'Usuario creado exitosamente.' };
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al crear el usuario.');
        }
    }

    static async update(id, name, email, role) {
        try {
            await pool.query('CALL sp_update_user(?, ?, ?, ?)', [id, name, email, role]);
            return { message: 'Usuario actualizado correctamente.' };
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al actualizar el usuario.');
        }
    }

    static async delete(id) {
        try {
            await pool.query('CALL sp_delete_user(?)', [id]);
            return { message: 'Usuario eliminado correctamente.' };
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al eliminar el usuario.');
        }
    }

    static async updateProfile(id, name, email, profilePicture) {
        try {
            await pool.query('CALL sp_update_user_profile(?, ?, ?, ?)', [id, name, email, profilePicture]);
            return { message: 'Perfil actualizado correctamente.' };
        } catch (error) {
            throw new Error(error.sqlMessage || 'Error al actualizar el perfil.');
        }
    }

    static async changePassword(id, currentPassword, newPassword) {
        try {
            const [results] = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
            if (results.length === 0) throw new Error('Usuario no encontrado.');

            const hashedPassword = results[0].password;
            const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
            if (!isMatch) throw new Error('La contraseña actual es incorrecta.');

            const newHashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.query('CALL sp_change_password(?, ?)', [id, newHashedPassword]);

            return { message: 'Contraseña actualizada correctamente.' };
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}

module.exports = User;
