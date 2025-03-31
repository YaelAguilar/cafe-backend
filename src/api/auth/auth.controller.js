const authService = require('./auth.service')
const { successResponse } = require('../../utils/response-formatter')

/**
 * Controlador para registrar un nuevo usuario
 */
exports.registerUser = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body)
    
    return res.status(201).json(successResponse(
      "Usuario registrado exitosamente.",
      { token: result.token, user: result.user }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Controlador para iniciar sesión
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)
    
    return res.status(200).json(successResponse(
      "Inicio de sesión exitoso.",
      { token: result.token, user: result.user }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Controlador para cerrar sesión
 */
exports.logoutUser = (req, res) => {
  return res.status(200).json(successResponse("Sesión cerrada exitosamente."))
}