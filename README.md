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
