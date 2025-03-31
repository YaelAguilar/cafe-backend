const producerService = require('./producer.service')
const { successResponse } = require('../../utils/response-formatter')
const fs = require('fs')
const { Producer } = require('../../models') // Añadir esta importación

/**
 * Obtiene el perfil del productor
 */
exports.getProducerProfile = async (req, res, next) => {
  try {
    const profile = await producerService.getProducerProfile(req.userId)
    
    return res.status(200).json(successResponse(
      "Perfil de productor obtenido exitosamente.",
      { profile }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Actualiza el perfil del productor
 */
exports.updateProducerProfile = async (req, res, next) => {
  try {
    const updatedProfile = await producerService.updateProducerProfile(req.userId, req.body)
    
    return res.status(200).json(successResponse(
      "Perfil de productor actualizado exitosamente.",
      { profile: updatedProfile }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Sube fotos del productor
 */
exports.uploadProducerPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se han proporcionado imágenes.",
      })
    }
    
    const uploadedImages = await producerService.uploadProducerPhotos(req.userId, req.files)
    
    return res.status(200).json(successResponse(
      `${uploadedImages.length} imágenes subidas exitosamente.`,
      { images: uploadedImages }
    ))
  } catch (error) {
    // Eliminar archivos temporales en caso de error
    if (req.files) {
      for (const file of req.files) {
        if (fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path)
          } catch (unlinkError) {
            console.error("Error al eliminar archivo temporal:", unlinkError)
          }
        }
      }
    }
    
    next(error)
  }
}

/**
 * Obtiene las fotos del productor
 */
exports.getProducerPhotos = async (req, res, next) => {
  try {
    let producerId;
    
    // Si se envía el parámetro producerId, lo usamos para buscar el productor
    if (req.query.producerId) {
      producerId = req.query.producerId;
    } else {
      // Si no se pasa, usamos el id del usuario autenticado
      const producer = await Producer.findOne({ where: { userId: req.userId } });
      if (!producer) {
        return res.status(404).json({
          success: false,
          message: "Perfil de productor no encontrado.",
        });
      }
      producerId = producer.id;
    }
    
    const photos = await producerService.getProducerPhotos(producerId);
    
    return res.status(200).json(successResponse(
      "Fotos obtenidas exitosamente.",
      { photos }
    ));
  } catch (error) {
    next(error);
  }
}

/**
 * Obtiene la lista de proveedores
 */
exports.getProviderList = async (req, res, next) => {
  try {
    const providers = await producerService.getProviderList();
    
    return res.status(200).json(successResponse(
      "Lista de proveedores obtenida exitosamente.",
      { providers }
    ));
  } catch (error) {
    next(error);
  }
}

/**
 * Obtiene un productor por su ID
 */
exports.getProducerById = async (req, res, next) => {
  try {
    const producerId = req.params.id;
    const provider = await producerService.getProducerById(producerId);
    
    return res.status(200).json(successResponse(
      "Perfil de productor obtenido exitosamente.",
      { provider }
    ));
  } catch (error) {
    next(error);
  }
}

/**
 * Sube imagen de perfil del productor
 */
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se ha proporcionado ninguna imagen.",
      });
    }
    
    const imageUrl = await producerService.uploadProfileImage(req.userId, req.file);
    
    return res.status(200).json(successResponse(
      "Imagen de perfil subida exitosamente.",
      { imageUrl }
    ));
  } catch (error) {
    // Eliminar archivo temporal en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo temporal:", unlinkError);
      }
    }
    
    next(error);
  }
}