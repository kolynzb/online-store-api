const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
const yamlJS = require('yamljs');

const app = express();
const swaggerDocument = yamlJS.load('../swagger.yaml');
const productRoute = require('./routes/product.routes');
const categoryRoute = require('./routes/category.routes');
const userRoute = require('./routes/user.routes');
const globalErrorHandler = require('./middleware/errorHandler.middleware');
const AppError = require('./utils/appError');

app.use(express.json());
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());

// API routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/category', categoryRoute);

// Global error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
