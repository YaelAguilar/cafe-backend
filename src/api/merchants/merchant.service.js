const { Merchant, User, MerchantSupplyNeeds } = require("../../models")
const { NotFoundError, BadRequestError } = require("../../utils/error-types")
const fs = require("fs")
const cloudinary = require("../../config/cloudinary.config")

/**
 * Obtiene el perfil de un comerciante
 */
const getMerchantProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Merchant,
        include: [{ model: MerchantSupplyNeeds, as: "MerchantSupplyNeeds" }],
      },
    ],
  })
  
  if (!user) {
    throw new NotFoundError("Usuario no encontrado.")
  }
  
  if (!user.Merchant) {
    throw new NotFoundError("Perfil de comerciante no encontrado.")
  }
  
  return user
}

/**
 * Actualiza el perfil de un comerciante
 */
const updateMerchantProfile = async (userId, profileData) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Merchant }],
  })
  
  if (!user) {
    throw new NotFoundError("Usuario no encontrado.")
  }
  
  if (!user.Merchant) {
    throw new NotFoundError("Perfil de comerciante no encontrado.")
  }
  
  // Validar campos obligatorios si se proporcionan todos
  if (profileData.businessName && profileData.businessType && 
      profileData.description && profileData.city && 
      profileData.state && profileData.phone) {
    
    const validBusinessTypes = ["cafeteria", "restaurante", "distribuidor", "tostador", "otro"]
    if (!validBusinessTypes.includes(profileData.businessType.toLowerCase())) {
      throw new BadRequestError("Tipo de negocio no válido.")
    }
  }
  
  await Merchant.update(profileData, {
    where: { id: user.Merchant.id },
  })
  
  return await getMerchantProfile(userId)
}

/**
 * Actualiza las necesidades de abastecimiento de un comerciante
 */
const updateMerchantSupplyNeeds = async (userId, supplyData) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Merchant }],
  })
  
  if (!user || !user.Merchant) {
    throw new NotFoundError("Perfil de comerciante no encontrado.")
  }
  
  const merchantId = user.Merchant.id
  
  // Validar datos
  if (!supplyData.coffeeTypes || !supplyData.qualities || 
      !supplyData.volumeRequired || !supplyData.purchaseFrequency) {
    throw new BadRequestError("Faltan campos obligatorios (tipos de café, calidades, volumen requerido, frecuencia de compra).")
  }
  
  if (!Array.isArray(supplyData.coffeeTypes) || supplyData.coffeeTypes.length === 0) {
    throw new BadRequestError("Debe seleccionar al menos un tipo de café.")
  }
  
  if (!Array.isArray(supplyData.qualities) || supplyData.qualities.length === 0) {
    throw new BadRequestError("Debe seleccionar al menos una calidad.")
  }
  
  const volume = Number.parseInt(supplyData.volumeRequired)
  if (isNaN(volume) || volume <= 0) {
    throw new BadRequestError("El volumen requerido debe ser un número positivo.")
  }
  
  // Buscar si ya existe un registro
  const existingNeeds = await MerchantSupplyNeeds.findOne({
    where: { merchantId },
  })
  
  if (existingNeeds) {
    // Actualizar registro existente
    await MerchantSupplyNeeds.update({
      coffeeTypes: supplyData.coffeeTypes,
      qualities: supplyData.qualities,
      volumeRequired: volume,
      purchaseFrequency: supplyData.purchaseFrequency,
      additionalRequirements: supplyData.additionalRequirements || "",
    }, {
      where: { merchantId },
    })
  } else {
    // Crear nuevo registro
    await MerchantSupplyNeeds.create({
      merchantId,
      coffeeTypes: supplyData.coffeeTypes,
      qualities: supplyData.qualities,
      volumeRequired: volume,
      purchaseFrequency: supplyData.purchaseFrequency,
      additionalRequirements: supplyData.additionalRequirements || "",
    })
  }
  
  // Obtener el registro actualizado
  return await MerchantSupplyNeeds.findOne({
    where: { merchantId },
  })
}

/**
 * Obtiene la lista de todos los comerciantes
 */
const listMerchants = async () => {
  return await Merchant.findAll({
    include: [
      { model: MerchantSupplyNeeds, as: "MerchantSupplyNeeds" },
      { model: User, attributes: { exclude: ["password"] } }
    ],
  })
}

/**
 * Sube la imagen de perfil de un productor a Cloudinary
 */
const uploadProfileImage = async (userId, file) => {
  const merchant = await Merchant.findOne({ where: { userId } })
  
  if (!merchant) {
    throw new NotFoundError("Perfil de productor no encontrado.")
  }
  
  try {
    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "cafe_connect/profile_images",
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "face"
    })
    
    // Actualizar URL de imagen en el perfil del productor
    await Merchant.update(
      { imageUrl: result.secure_url },
      { where: { id: merchant.id } }
    )
    
    // Eliminar el archivo temporal
    fs.unlinkSync(file.path)
    
    return result.secure_url
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error)
    throw new Error("Error al procesar la imagen.")
  }
}

module.exports = {
  getMerchantProfile,
  uploadProfileImage,
  updateMerchantProfile,
  updateMerchantSupplyNeeds,
  listMerchants
}