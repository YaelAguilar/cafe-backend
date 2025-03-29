const perfilModel = require('../models/perfilModel');
const cloudinary = require('../config/cloudinaryConfig');

exports.getPerfil = async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id || req.userId;
    
    const perfil = await perfilModel.getOrCreatePerfil(usuario_id);
    
    return res.status(200).json({
      success: true,
      data: perfil
    });
  } catch (error) {
    console.error('Error en getPerfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener el perfil.'
    });
  }
};

exports.updatePerfil = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const {
      descripcion,
      ubicacion,
      telefono,
      sitio_web,
      redes_sociales,
      certificaciones
    } = req.body;
    
    const updatedFields = {};
    
    if (descripcion !== undefined) updatedFields.descripcion = descripcion.trim();
    if (ubicacion !== undefined) updatedFields.ubicacion = ubicacion.trim();
    if (telefono !== undefined) updatedFields.telefono = telefono.trim();
    if (sitio_web !== undefined) updatedFields.sitio_web = sitio_web.trim();
    if (redes_sociales !== undefined) updatedFields.redes_sociales = redes_sociales;
    if (certificaciones !== undefined) updatedFields.certificaciones = certificaciones;
    
    // Procesar foto de perfil si existe
    if (req.file) {
      const base64String = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${base64String}`;
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'cafeconnect/perfiles'
      });
      updatedFields.foto_perfil = uploadResponse.secure_url;
    }
    
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar.'
      });
    }
    
    // Asegurarse de que el perfil existe
    await perfilModel.getOrCreatePerfil(usuario_id);
    
    const updatedPerfil = await perfilModel.updatePerfil(usuario_id, updatedFields);
    
    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente.',
      data: updatedPerfil
    });
  } catch (error) {
    console.error('Error en updatePerfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al actualizar el perfil.'
    });
  }
};