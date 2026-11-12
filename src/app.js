const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');
const notasRoutes = require('./routes/notas.routes');
const iaRoutes = require('./routes/ia.routes');

const app = express();

app.use(express.json());
/**
 * @openapi
 * /api-docs:
 *   get:
 *     summary: Documentación interactiva (Swagger UI)
 *     tags: [Documentación]
 *     responses:
 *       200:
 *         description: Interfaz gráfica de Swagger UI
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/notas', notasRoutes);
app.use('/api/ia', iaRoutes);
app.use(errorHandler);

module.exports = app;

