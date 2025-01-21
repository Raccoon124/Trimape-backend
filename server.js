const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const checkInsRoutes = require('./routes/checkIns'); // Ajusta la ruta según la estructura de tu proyecto
require('dotenv').config(); // Cargar variables de entorno
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors({
    origin: 'http://localhost:8080', // Dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Permitir el envío de cookies (si es necesario)
}));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // Registrar las rutas de autenticación
app.use('/api/check-ins', checkInsRoutes);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta base para probar que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡El backend de ERP está funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
