const merchantService = require('./merchant.service')
const { successResponse } = require('../../utils/response-formatter')
const fs = require('fs')

/**
 * Obtiene el perfil del comerciante
 */
exports.getMerchantProfile = async (req, res, next) => {
  try {
    const profile = await merchantService.getMerchantProfile(req.userId)
    
    return res.status(200).json(successResponse(
      "Perfil de comerciante obtenido exitosamente.",
      { profile }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Actualiza el perfil del comerciante
 */
exports.updateMerchantProfile = async (req, res, next) => {
  try {
    const updatedProfile = await merchantService.updateMerchantProfile(req.userId, req.body)
    
    return res.status(200).json(successResponse(
      "Perfil actualizado exitosamente.",
      { profile: updatedProfile }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Actualiza las necesidades de abastecimiento del comerciante
 */
exports.updateMerchantSupplyNeeds = async (req, res, next) => {
  try {
    const updatedSupplyNeeds = await merchantService.updateMerchantSupplyNeeds(req.userId, req.body)
    
    return res.status(200).json(successResponse(
      "Necesidades de abastecimiento actualizadas exitosamente.",
      { supplyNeeds: updatedSupplyNeeds }
    ))
  } catch (error) {
    next(error)
  }
}

/**
 * Lista todos los comerciantes
 */
exports.listMerchants = async (req, res, next) => {
  try {
    const merchants = await merchantService.listMerchants();
    
    return res.status(200).json(successResponse(
      "Lista de comerciantes obtenida exitosamente.",
      { merchants }
    ));
  } catch (error) {
    next(error);
  }
}

/**
 * Sube imagen de perfil del comerciante
 */
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se ha proporcionado ninguna imagen.",
      });
    }
    
    const imageUrl = await merchantService.uploadProfileImage(req.userId, req.file);
    
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