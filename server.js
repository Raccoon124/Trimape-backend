const app = require('./app'); // Importa la configuración de Express
require('dotenv').config({ path: process.env.NODE_ENV === 'qa' ? './.env.qa' : './.env.production' });

const PORT = process.env.PORT || 3000;

// Iniciar el servidor en HTTP (Plesk manejará HTTPS)
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});