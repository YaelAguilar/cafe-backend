/**
 * Error personalizado para la API
 */
class ApiError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Error para recursos no encontrados (404)
   */
  class NotFoundError extends ApiError {
    constructor(message = 'Recurso no encontrado') {
      super(message, 404);
    }
  }
  
  /**
   * Error para solicitudes no válidas (400)
   */
  class BadRequestError extends ApiError {
    constructor(message = 'Solicitud no válida') {
      super(message, 400);
    }
  }
  
  /**
   * Error para acceso no autorizado (401)
   */
  class UnauthorizedError extends ApiError {
    constructor(message = 'No autorizado') {
      super(message, 401);
    }
  }
  
  /**
   * Error para acceso prohibido (403)
   */
  class ForbiddenError extends ApiError {
    constructor(message = 'Acceso prohibido') {
      super(message, 403);
    }
  }
  
  /**
   * Error para conflictos (409)
   */
  class ConflictError extends ApiError {
    constructor(message = 'Conflicto con el estado actual') {
      super(message, 409);
    }
  }
  
  module.exports = {
    ApiError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError
  };