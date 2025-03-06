const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Importar rutas
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const checkInsRoutes = require('./routes/checkIns');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de CORS
app.use(cors({
    origin: ['https://localhost:8080', 'https://127.0.0.1:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Servir archivos estáticos (para imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/check-ins', checkInsRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.send('🚀 ¡El backend de ERP está funcionando!');
});

module.exports = app;
