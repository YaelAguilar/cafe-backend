const express = require('express')
const router = express.Router()

// Importar rutas
const authRoutes = require('./auth/auth.routes')
const userRoutes = require('./users/user.routes')
const producerRoutes = require('./producers/producer.routes')
const merchantRoutes = require('./merchants/merchant.routes')

// Configurar rutas
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/producers', producerRoutes)
router.use('/merchants', merchantRoutes)

module.exports = router