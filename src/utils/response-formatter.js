/**
 * Formatea una respuesta exitosa
 * @param {string} message - Mensaje de éxito
 * @param {object} data - Datos a devolver
 * @returns {object} - Objeto de respuesta formateado
 */
const successResponse = (message, data = {}) => {
    return {
      success: true,
      message,
      ...data
    };
  };
  
  /**
   * Formatea una respuesta de error
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código de estado HTTP
   * @returns {object} - Objeto de error formateado
   */
  const errorResponse = (message, statusCode = 500) => {
    return {
      success: false,
      message,
      statusCode
    };
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };