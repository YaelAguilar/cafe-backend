const userService = require('./user.service')
const { successResponse } = require('../../utils/response-formatter')

/**
 * Obtiene el perfil del usuario autenticado
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.userId)
    
    return res.status(200).json(successResponse(
      "Perfil obtenido exitosamente.",
      { user }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Actualiza el perfil del usuario autenticado
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.userId, req.body)
    
    return res.status(200).json(successResponse(
      "Perfil actualizado exitosamente.",
      { user: updatedUser }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Lista todos los usuarios excepto el actual
 */
exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.userId)
    
    return res.status(200).json(successResponse(
      "Usuarios obtenidos exitosamente.",
      { users }
    ))
  } catch (error) {
    next(error)
  }
}