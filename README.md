# PowerFitness Web

Backoffice de administración del gimnasio **Power Fitness**.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [npm](https://www.npmjs.com/)

## Configuración del entorno

El proyecto utiliza ficheros de entorno de Vite para definir la URL base de la API.

1. Crea un archivo `.env.local` para el desarrollo local y otro llamado `.env.production` para la versión de producción.
2. En ambos define la variable `VITE_API_BASE_URL` con la URL correspondiente al backend.

Ejemplo:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Ajusta el valor de `.env.production` para que apunte a la API real en producción.

Durante el desarrollo, la configuración de Vite incluye un *proxy* que redirige
las peticiones a rutas que empiecen por `/api` hacia la URL definida en
`VITE_API_BASE_URL`. Esto evita los problemas de CORS mientras trabajas en
local.

## Levantar el proyecto en local

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Asegúrate de que `.env.local` contenga el valor correcto de `VITE_API_BASE_URL`.
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Vite abrirá la aplicación en `http://localhost:5173` por defecto.

## Desplegar a producción

1. Configura `.env.production` con la URL de la API de producción.
2. Genera los archivos listos para producción:
   ```bash
   npm run build
   ```
   El resultado se colocará en la carpeta `dist/`.
3. Sirve el contenido de `dist/` con el servidor web de tu elección (por ejemplo Nginx o un servicio de alojamiento estático).
4. Opcionalmente, puedes ejecutar `npm run preview` para comprobar localmente la compilación antes de publicarla.
