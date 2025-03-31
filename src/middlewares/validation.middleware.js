const { BadRequestError } = require('../utils/error-types');
const { validateEmail, validateString, validatePassword } = require('../utils/validators');

/**
 * Middleware para validar datos de registro
 */
const validateRegisterData = (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword, userType, businessName } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword || !userType || !businessName) {
    throw new BadRequestError('Todos los campos son obligatorios.');
  }

  if (!validateString(firstName) || !validateString(lastName)) {
    throw new BadRequestError('El nombre y el apellido deben tener al menos 2 caracteres.');
  }

  if (!validateEmail(email)) {
    throw new BadRequestError('El formato de email no es válido.');
  }

  if (!validatePassword(password)) {
    throw new BadRequestError('La contraseña debe tener al menos 6 caracteres.');
  }

  if (password !== confirmPassword) {
    throw new BadRequestError('Las contraseñas no coinciden.');
  }

  if (!['producer', 'merchant'].includes(userType)) {
    throw new BadRequestError('Tipo de usuario no válido.');
  }

  next();
};

/**
 * Middleware para validar datos de inicio de sesión
 */
const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Correo electrónico y contraseña son obligatorios.');
  }

  if (!validateEmail(email)) {
    throw new BadRequestError('El formato de email no es válido.');
  }

  next();
};

module.exports = {
  validateRegisterData,
  validateLoginData
};