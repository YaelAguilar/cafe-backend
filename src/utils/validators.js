/**
 * Valida un formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido, false si no
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  /**
   * Valida que un string tenga una longitud mínima
   * @param {string} value - String a validar
   * @param {number} minLength - Longitud mínima
   * @returns {boolean} - true si es válido, false si no
   */
  const validateString = (value, minLength = 2) => {
    return typeof value === "string" && value.trim().length >= minLength
  }
  
  /**
   * Valida que una contraseña tenga una longitud mínima
   * @param {string} password - Contraseña a validar
   * @param {number} minLength - Longitud mínima
   * @returns {boolean} - true si es válida, false si no
   */
  const validatePassword = (password, minLength = 6) => {
    return typeof password === "string" && password.length >= minLength
  }
  
  module.exports = {
    validateEmail,
    validateString,
    validatePassword
  }