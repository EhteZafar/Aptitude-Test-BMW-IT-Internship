const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Import routes
const carsRoutes = require('./routes/carsRoutes');

// Import Swagger configuration
const { swaggerSpec, swaggerUi } = require('./config/swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Simple endpoint to verify that the API is running and accessible.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "BMW Aptitude Test API is running..."
 */
app.get('/', (req, res) => {
  res.send('BMW Aptitude Test API is running...');
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'BMW Aptitude Test API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API routes
app.use('/api/cars', carsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
