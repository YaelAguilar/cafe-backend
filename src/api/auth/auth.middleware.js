const jwt = require("jsonwebtoken")
const { UnauthorizedError, ForbiddenError } = require("../../utils/error-types")

/**
 * Middleware de autenticación que verifica el token JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedError("Acceso denegado. Token no provisto.")
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      throw new UnauthorizedError("Acceso denegado. Formato de token inválido.")
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Token decodificado:", decoded)

      req.userId = decoded.userId
      req.userEmail = decoded.email
      req.userType = decoded.userType

      next()
    } catch (jwtError) {
      console.log("Error al verificar el token:", jwtError)

      // Para propósitos de desarrollo, permitimos continuar con un userId de prueba
      // IMPORTANTE: Eliminar esto en producción
      if (process.env.NODE_ENV === 'development') {
        console.log("MODO DESARROLLO: Continuando con userId de prueba")
        req.userId = 1
        req.userType = "producer"
        next()
        return
      }

      throw new UnauthorizedError("Token inválido o expirado.")
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Middleware que verifica si el usuario es un productor
 */
const isProducer = (req, res, next) => {
  if (req.userType !== "producer") {
    throw new ForbiddenError("Acceso denegado. Solo productores pueden acceder a este recurso.")
  }
  next()
}

/**
 * Middleware que verifica si el usuario es un comerciante
 */
const isMerchant = (req, res, next) => {
  if (req.userType !== "merchant") {
    throw new ForbiddenError("Acceso denegado. Solo comerciantes pueden acceder a este recurso.")
  }
  next()
}

module.exports = {
  authMiddleware,
  isProducer,
  isMerchant
};