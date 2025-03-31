const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User, Producer, Merchant } = require("../../models")
const { validateEmail, validateString, validatePassword } = require("../../utils/validators")
const { NotFoundError, BadRequestError, ConflictError, UnauthorizedError } = require("../../utils/error-types")

/**
 * Registra un nuevo usuario
 */
const registerUser = async (userData) => {
  const { firstName, lastName, email, password, confirmPassword, userType, businessName } = userData

  // Validar campos obligatorios
  if (!firstName || !lastName || !email || !password || !confirmPassword || !userType || !businessName) {
    throw new BadRequestError("Todos los campos son obligatorios.")
  }

  // Validar formato de campos
  if (!validateString(firstName) || !validateString(lastName)) {
    throw new BadRequestError("El nombre y el apellido deben tener al menos 2 caracteres.")
  }

  if (!validateEmail(email)) {
    throw new BadRequestError("El formato de email no es válido.")
  }

  if (!validatePassword(password)) {
    throw new BadRequestError("La contraseña debe tener al menos 6 caracteres.")
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("Las contraseñas no coinciden.")
  }

  if (!["producer", "merchant"].includes(userType)) {
    throw new BadRequestError("Tipo de usuario no válido.")
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw new ConflictError("El correo electrónico ya está registrado.")
  }

  // Encriptar contraseña
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Crear usuario
  const newUser = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    userType,
  })

  // Crear perfil según tipo de usuario
  if (userType === "merchant") {
    await Merchant.create({
      userId: newUser.id,
      businessName: businessName.trim(),
    })
  } else if (userType === "producer") {
    await Producer.create({
      userId: newUser.id,
      businessName: businessName.trim(),
    })
  }

  // Generar token
  const token = generateToken(newUser)

  return {
    token,
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      userType: newUser.userType,
    }
  }
}

/**
 * Inicia sesión de un usuario
 */
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new BadRequestError("Correo electrónico y contraseña son obligatorios.")
  }

  if (!validateEmail(email)) {
    throw new BadRequestError("El formato de email no es válido.")
  }

  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw new UnauthorizedError("Credenciales inválidas.")
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new UnauthorizedError("Credenciales inválidas.")
  }

  const token = generateToken(user)

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
    }
  }
}

/**
 * Genera un token JWT para un usuario
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  )
}

module.exports = {
  registerUser,
  loginUser
}