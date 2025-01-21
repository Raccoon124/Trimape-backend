# TRIMAPE Backend

Backend del proyecto TRIMAPE, diseñado para gestionar procesos relacionados con órdenes de servicio, check-ins, reportes y más, proporcionando una solución eficiente y escalable.

## 🚀 Características Principales

- **Autenticación JWT**: Sistema seguro de login y protección de endpoints sensibles.
- **Gestión de Usuarios**: CRUD completo para usuarios.
- **Check-ins**: Registro de actividades con coordenadas y evidencia fotográfica.
- **Procedimientos Almacenados**: Uso de stored procedures para mayor eficiencia y seguridad en las consultas de base de datos.

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Plataforma principal para el backend.
- **Express**: Framework para la creación de endpoints.
- **MySQL**: Base de datos relacional.
- **JWT**: Autenticación basada en tokens.
- **Multer**: Subida de archivos como fotos de perfil y evidencias.

## 📂 Estructura del Proyecto

```plaintext
TRIMAPE-BACKEND/
├── src/
│   ├── controllers/      # Controladores para manejar lógica de negocio
│   ├── routes/           # Definición de endpoints
│   ├── middlewares/      # Middleware como autenticación JWT
│   ├── models/           # Interacciones con la base de datos
│   ├── utils/            # Utilidades y helpers
├── uploads/              # Almacenamiento temporal de imágenes
├── package.json          # Dependencias del proyecto
├── .env                  # Variables de entorno
└── README.md             # Documentación del proyecto
```


📋 Instalación

    Clona este repositorio:

Mostrar siempre los detalles

git clone https://github.com/Raccoon124/TRIMAPE-BACKEND.git
cd TRIMAPE-BACKEND

Instala las dependencias:

Mostrar siempre los detalles

npm install

Configura las variables de entorno en un archivo .env:

Mostrar siempre los detalles

DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=trimape_db
JWT_SECRET=tu_secreto_jwt
PORT=3000

Inicia el servidor:

Mostrar siempre los detalles

    npm start

    Accede al backend en http://localhost:3000.

🧪 Endpoints Disponibles
Usuarios

    POST /api/users: Crear un nuevo usuario.
    GET /api/users: Listar todos los usuarios.
    GET /api/users/:id: Obtener un usuario específico.
    PUT /api/users/:id: Actualizar un usuario.
    DELETE /api/users/:id: Eliminar un usuario.

Check-ins

    POST /api/check-ins: Registrar un check-in con foto y coordenadas.
    GET /api/check-ins: Listar todos los check-ins.
    GET /api/check-ins/:id: Obtener un check-in específico.

🔧 Próximos Pasos

    Implementar CRUD para órdenes de servicio.
    Desarrollar endpoints para reportes diarios.
    Optimizar consultas y añadir pruebas automáticas.

🖊️ Contribuciones

¡Contribuciones son bienvenidas! Si deseas colaborar, por favor crea un fork del repositorio, realiza tus cambios y envía un pull request.
📄 Licencia

Este proyecto está bajo la licencia MIT.
💬 Contacto

Si tienes dudas o sugerencias, por favor contáctame




