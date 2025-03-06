const https = require('https');
const fs = require('fs');
const app = require('./app'); // Importa la configuración de Express
require('dotenv').config(); // Cargar variables de entorno

const PORT = process.env.PORT || 3000;

// Configuración de HTTPS
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
};

// Iniciar el servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en https://localhost:${PORT}`);
});
