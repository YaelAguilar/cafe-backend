const { ApiError } = require('../utils/error-types');
const { errorResponse } = require('../utils/response-formatter');

/**
 * Middleware para manejar errores globalmente
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.statusCode));
  }

  // Error de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json(errorResponse(messages.join(', '), 400));
  }

  // Error genérico
  return res.status(500).json(errorResponse('Error interno del servidor', 500));
};

module.exports = errorHandler;