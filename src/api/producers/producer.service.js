const { Producer, User, ProducerPhoto } = require("../../models")
const cloudinary = require("../../config/cloudinary.config")
const fs = require("fs")
const { NotFoundError, BadRequestError } = require("../../utils/error-types")

/**
 * Obtiene el perfil de un productor
 */
const getProducerProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [{ model: Producer }]
  })
  
  if (!user) {
    throw new NotFoundError("Usuario no encontrado.")
  }
  
  if (!user.Producer) {
    throw new NotFoundError("Perfil de productor no encontrado.")
  }
  
  return user
}

/**
 * Actualiza el perfil de un productor
 */
const updateProducerProfile = async (userId, profileData) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Producer }]
  })
  
  if (!user) {
    throw new NotFoundError("Usuario no encontrado.")
  }
  
  if (!user.Producer) {
    // Crear perfil de productor si no existe
    await Producer.create({
      userId: user.id,
      ...profileData
    })
  } else {
    // Actualizar perfil existente
    await Producer.update(profileData, {
      where: { userId }
    })
  }
  
  return await getProducerProfile(userId)
}

/**
 * Sube la imagen de perfil de un productor a Cloudinary
 */
const uploadProfileImage = async (userId, file) => {
  const producer = await Producer.findOne({ where: { userId } })
  
  if (!producer) {
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
    await Producer.update(
      { imageUrl: result.secure_url },
      { where: { id: producer.id } }
    )
    
    // Eliminar el archivo temporal
    fs.unlinkSync(file.path)
    
    return result.secure_url
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error)
    throw new Error("Error al procesar la imagen.")
  }
}

/**
 * Sube fotos de un productor a Cloudinary
 */
const uploadProducerPhotos = async (userId, files) => {
  const producer = await Producer.findOne({ where: { userId } })
  
  if (!producer) {
    throw new NotFoundError("Perfil de productor no encontrado.")
  }
  
  const uploadedImages = []
  
  // Subir cada imagen a Cloudinary
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "cafe_connect/producer_photos",
        width: 1200,
        height: 800,
        crop: "limit",
      })
      
      // Guardar la referencia en la base de datos
      const photo = await ProducerPhoto.create({
        producerId: producer.id,
        imageUrl: result.secure_url,
        publicId: result.public_id,
        title: file.originalname.split(".")[0], // Usar el nombre del archivo como título
        description: "",
      })
      
      uploadedImages.push({
        id: photo.id,
        url: result.secure_url,
        publicId: result.public_id,
        title: photo.title,
      })
      
      // Eliminar el archivo temporal
      fs.unlinkSync(file.path)
    } catch (uploadError) {
      console.error(`Error al subir ${file.originalname} a Cloudinary:`, uploadError)
      // Continuar con el siguiente archivo
    }
  }
  
  return uploadedImages
}

/**
 * Obtiene las fotos de un productor
 */
const getProducerPhotos = async (producerId) => {
  const photos = await ProducerPhoto.findAll({
    where: { producerId },
    order: [["uploadDate", "DESC"]],
  })
  
  return photos.map((photo) => ({
    id: photo.id,
    imageUrl: photo.imageUrl,
    title: photo.title,
    description: photo.description,
    uploadDate: photo.uploadDate,
  }))
}

/**
 * Obtiene la lista de todos los productores
 */
const getProviderList = async () => {
  return await User.findAll({
    where: { userType: "producer" },
    attributes: { exclude: ["password"] },
    include: [{ model: Producer }],
  })
}

/**
 * Obtiene un productor por su ID
 */
const getProducerById = async (producerId) => {
  const producer = await Producer.findByPk(producerId, {
    include: [{ 
      model: User, 
      attributes: { exclude: ["password"] } 
    }],
  })
  
  if (!producer) {
    throw new NotFoundError("Productor no encontrado.")
  }
  
  return { Producer: producer }
}

module.exports = {
  getProducerProfile,
  updateProducerProfile,
  uploadProfileImage,
  uploadProducerPhotos,
  getProducerPhotos,
  getProviderList,
  getProducerById
}