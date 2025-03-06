const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0,
};

// Crear un pool de conexiones
const pool = mysql.createPool(dbConfig);

// Verificar la conexión
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        connection.release(); // Liberar la conexión
    } catch (error) {
        console.error('❌ Error al conectar con MySQL:', error.message);
        process.exit(1); // Salir de la aplicación si la conexión falla
    }
})();

module.exports = pool;
