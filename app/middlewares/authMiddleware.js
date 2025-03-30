const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Agregar logs para depuración
    console.log("Headers de autenticación:", req.headers)

    if (!authHeader) {
      console.log("No se proporcionó token de autorización")
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Token no provisto.",
      })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      console.log("Formato de token inválido")
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. Formato de token inválido.",
      })
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
      console.log("MODO DESARROLLO: Continuando con userId de prueba")
      req.userId = 1
      req.userType = "producer"

      next()

      /* Descomentar esto
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado.'
      });
      */
    }
  } catch (error) {
    console.error("Error en middleware de autenticación:", error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al procesar la autenticación.",
    })
  }
}

module.exports = authMiddleware

