const { User } = require("../../models")
const { NotFoundError } = require("../../utils/error-types")
const bcrypt = require("bcryptjs")
const { validateEmail, validateString, validatePassword } = require("../../utils/validators")

/**
 * Obtiene el perfil de un usuario por ID
 */
const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] }
  })
  
  if (!user) {
    throw new NotFoundError("Usuario no encontrado.")
  }
  
  return user
}

/**
 * Actualiza el perfil de un usuario
 */
const updateUserProfile = async (userId, userData) => {
  const user = await User.findByPk(userId)
  
  if (!user) {
    throw new NotFoundError("Usuario no encontrado.")
  }

  const updatedData = {}

  // Validar y preparar datos para actualización
  if (userData.firstName) {
    if (!validateString(userData.firstName)) {
      throw new BadRequestError("El nombre debe tener al menos 2 caracteres.")
    }
    updatedData.firstName = userData.firstName.trim()
  }

  if (userData.lastName) {
    if (!validateString(userData.lastName)) {
      throw new BadRequestError("El apellido debe tener al menos 2 caracteres.")
    }
    updatedData.lastName = userData.lastName.trim()
  }

  if (userData.email) {
    if (!validateEmail(userData.email)) {
      throw new BadRequestError("El formato de email no es válido.")
    }
    const existingUser = await User.findOne({ where: { email: userData.email } })
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictError("El email ya está en uso por otro usuario.")
    }
    updatedData.email = userData.email.trim().toLowerCase()
  }

  if (userData.password) {
    if (!validatePassword(userData.password)) {
      throw new BadRequestError("La contraseña debe tener al menos 6 caracteres.")
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(userData.password, salt)
    updatedData.password = hashedPassword
  }

  // Actualizar usuario
  await User.update(updatedData, { where: { id: userId } })
  
  return await getUserProfile(userId)
}

/**
 * Obtiene todos los usuarios
 */
const getAllUsers = async (currentUserId) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] }
  })
  
  return users.filter(user => user.id !== currentUserId)
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers
}