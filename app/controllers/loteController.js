const loteModel = require('../models/loteModel');
const cloudinary = require('../config/cloudinaryConfig');

exports.createLote = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.userType;
    
    // Verificar que el usuario sea productor (type = false)
    if (userType !== false) {
      return res.status(403).json({
        success: false,
        message: 'Solo los productores pueden crear lotes de café.'
      });
    }
    
    const { 
      nombre, 
      variedad, 
      cantidad_kg, 
      precio_por_kg, 
      descripcion, 
      proceso, 
      altitud, 
      region, 
      certificaciones,
      fecha_cosecha,
      atributos_sensoriales
    } = req.body;
    
    // Validar campos obligatorios
    if (!nombre || !variedad || !cantidad_kg || !precio_por_kg || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios.'
      });
    }
    
    // Procesar imágenes si existen
    let fotosArray = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64String = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64String}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'cafeconnect/lotes'
        });
        fotosArray.push(uploadResponse.secure_url);
      }
    }
    
    // Crear objeto de lote
    const loteData = {
      nombre: nombre.trim(),
      variedad: variedad.trim(),
      cantidad_kg: parseFloat(cantidad_kg),
      precio_por_kg: parseFloat(precio_por_kg),
      descripcion: descripcion.trim(),
      productor_id: userId,
      fotos: fotosArray,
      estado: 'disponible'
    };
    
    // Añadir campos opcionales si existen
    if (proceso) loteData.proceso = proceso.trim();
    if (altitud) loteData.altitud = parseInt(altitud);
    if (region) loteData.region = region.trim();
    if (certificaciones) loteData.certificaciones = certificaciones;
    if (fecha_cosecha) loteData.fecha_cosecha = new Date(fecha_cosecha);
    if (atributos_sensoriales) loteData.atributos_sensoriales = atributos_sensoriales;
    
    const newLote = await loteModel.createLote(loteData);
    
    return res.status(201).json({
      success: true,
      message: 'Lote de café creado exitosamente.',
      data: newLote
    });
  } catch (error) {
    console.error('Error en createLote:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al crear el lote de café.'
    });
  }
};

exports.getAllLotes = async (req, res) => {
  try {
    const lotes = await loteModel.getAllLotes();
    return res.status(200).json({
      success: true,
      data: lotes
    });
  } catch (error) {
    console.error('Error en getAllLotes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener los lotes de café.'
    });
  }
};

exports.getLoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const lote = await loteModel.getLoteById(id);
    
    if (!lote) {
      return res.status(404).json({
        success: false,
        message: 'Lote de café no encontrado.'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: lote
    });
  } catch (error) {
    console.error('Error en getLoteById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener el lote de café.'
    });
  }
};

exports.getLotesByProductor = async (req, res) => {
  try {
    const productorId = req.params.productorId || req.userId;
    const lotes = await loteModel.getLotesByProductor(productorId);
    
    return res.status(200).json({
      success: true,
      data: lotes
    });
  } catch (error) {
    console.error('Error en getLotesByProductor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener los lotes del productor.'
    });
  }
};

exports.updateLote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Verificar que el lote exista
    const lote = await loteModel.getLoteById(id);
    if (!lote) {
      return res.status(404).json({
        success: false,
        message: 'Lote de café no encontrado.'
      });
    }
    
    // Verificar que el usuario sea el dueño del lote
    if (lote.productor_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este lote.'
      });
    }
    
    const updatedFields = {};
    const allowedFields = [
      'nombre', 'variedad', 'cantidad_kg', 'precio_por_kg', 
      'estado', 'descripcion', 'proceso', 'altitud', 
      'region', 'certificaciones', 'fecha_cosecha', 'atributos_sensoriales'
    ];
    
    // Copiar solo los campos permitidos que existen en la solicitud
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updatedFields[field] = req.body[field];
      }
    });
    
    // Procesar nuevas imágenes si existen
    if (req.files && req.files.length > 0) {
      let fotosArray = lote.fotos || [];
      
      for (const file of req.files) {
        const base64String = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64String}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'cafeconnect/lotes'
        });
        fotosArray.push(uploadResponse.secure_url);
      }
      
      updatedFields.fotos = fotosArray;
    }
    
    // Si se proporciona un array de fotos a mantener
    if (req.body.mantener_fotos && Array.isArray(req.body.mantener_fotos)) {
      updatedFields.fotos = req.body.mantener_fotos;
    }
    
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar.'
      });
    }
    
    const updatedLote = await loteModel.updateLote(id, updatedFields);
    
    return res.status(200).json({
      success: true,
      message: 'Lote de café actualizado exitosamente.',
      data: updatedLote
    });
  } catch (error) {
    console.error('Error en updateLote:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al actualizar el lote de café.'
    });
  }
};

exports.deleteLote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Verificar que el lote exista
    const lote = await loteModel.getLoteById(id);
    if (!lote) {
      return res.status(404).json({
        success: false,
        message: 'Lote de café no encontrado.'
      });
    }
    
    // Verificar que el usuario sea el dueño del lote
    if (lote.productor_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este lote.'
      });
    }
    
    await loteModel.deleteLote(id);
    
    return res.status(200).json({
      success: true,
      message: 'Lote de café eliminado exitosamente.'
    });
  } catch (error) {
    console.error('Error en deleteLote:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al eliminar el lote de café.'
    });
  }
};

exports.searchLotes = async (req, res) => {
  try {
    const criteria = req.query;
    const lotes = await loteModel.searchLotes(criteria);
    
    return res.status(200).json({
      success: true,
      data: lotes
    });
  } catch (error) {
    console.error('Error en searchLotes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al buscar lotes de café.'
    });
  }
};