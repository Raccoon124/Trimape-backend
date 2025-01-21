const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con MySQL:', err.message);
        process.exit(1);
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = db;
