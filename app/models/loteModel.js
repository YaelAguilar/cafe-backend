const Lote = require('./Lote');
const User = require('./User');
const { Op } = require('sequelize');

const loteModel = {};

loteModel.createLote = async (loteData) => {
  // Convertir arrays a JSON strings
  if (loteData.fotos && Array.isArray(loteData.fotos)) {
    loteData.fotos = JSON.stringify(loteData.fotos);
  }
  if (loteData.certificaciones && Array.isArray(loteData.certificaciones)) {
    loteData.certificaciones = JSON.stringify(loteData.certificaciones);
  }
  if (loteData.atributos_sensoriales && typeof loteData.atributos_sensoriales === 'object') {
    loteData.atributos_sensoriales = JSON.stringify(loteData.atributos_sensoriales);
  }
  
  return await Lote.create(loteData);
};

loteModel.getAllLotes = async () => {
  const lotes = await Lote.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'productor',
        attributes: ['id', 'name', 'lastname', 'email']
      }
    ]
  });
  
  // Convertir JSON strings a objetos
  return lotes.map(lote => {
    const loteData = lote.toJSON();
    
    if (loteData.fotos) {
      try {
        loteData.fotos = JSON.parse(loteData.fotos);
      } catch (e) {
        loteData.fotos = [];
      }
    }
    
    if (loteData.certificaciones) {
      try {
        loteData.certificaciones = JSON.parse(loteData.certificaciones);
      } catch (e) {
        loteData.certificaciones = [];
      }
    }
    
    if (loteData.atributos_sensoriales) {
      try {
        loteData.atributos_sensoriales = JSON.parse(loteData.atributos_sensoriales);
      } catch (e) {
        loteData.atributos_sensoriales = {};
      }
    }
    
    return loteData;
  });
};

loteModel.getLoteById = async (id) => {
  const lote = await Lote.findByPk(id, {
    include: [
      {
        model: User,
        as: 'productor',
        attributes: ['id', 'name', 'lastname', 'email']
      }
    ]
  });
  
  if (!lote) return null;
  
  const loteData = lote.toJSON();
  
  // Convertir JSON strings a objetos
  if (loteData.fotos) {
    try {
      loteData.fotos = JSON.parse(loteData.fotos);
    } catch (e) {
      loteData.fotos = [];
    }
  }
  
  if (loteData.certificaciones) {
    try {
      loteData.certificaciones = JSON.parse(loteData.certificaciones);
    } catch (e) {
      loteData.certificaciones = [];
    }
  }
  
  if (loteData.atributos_sensoriales) {
    try {
      loteData.atributos_sensoriales = JSON.parse(loteData.atributos_sensoriales);
    } catch (e) {
      loteData.atributos_sensoriales = {};
    }
  }
  
  return loteData;
};

loteModel.getLotesByProductor = async (productorId) => {
  const lotes = await Lote.findAll({
    where: { productor_id: productorId },
    order: [['createdAt', 'DESC']]
  });
  
  // Convertir JSON strings a objetos
  return lotes.map(lote => {
    const loteData = lote.toJSON();
    
    if (loteData.fotos) {
      try {
        loteData.fotos = JSON.parse(loteData.fotos);
      } catch (e) {
        loteData.fotos = [];
      }
    }
    
    if (loteData.certificaciones) {
      try {
        loteData.certificaciones = JSON.parse(loteData.certificaciones);
      } catch (e) {
        loteData.certificaciones = [];
      }
    }
    
    if (loteData.atributos_sensoriales) {
      try {
        loteData.atributos_sensoriales = JSON.parse(loteData.atributos_sensoriales);
      } catch (e) {
        loteData.atributos_sensoriales = {};
      }
    }
    
    return loteData;
  });
};

loteModel.updateLote = async (id, updatedFields) => {
  // Convertir arrays a JSON strings
  if (updatedFields.fotos && Array.isArray(updatedFields.fotos)) {
    updatedFields.fotos = JSON.stringify(updatedFields.fotos);
  }
  if (updatedFields.certificaciones && Array.isArray(updatedFields.certificaciones)) {
    updatedFields.certificaciones = JSON.stringify(updatedFields.certificaciones);
  }
  if (updatedFields.atributos_sensoriales && typeof updatedFields.atributos_sensoriales === 'object') {
    updatedFields.atributos_sensoriales = JSON.stringify(updatedFields.atributos_sensoriales);
  }
  
  await Lote.update(updatedFields, { where: { id } });
  return await loteModel.getLoteById(id);
};

loteModel.deleteLote = async (id) => {
  return await Lote.destroy({ where: { id } });
};

loteModel.searchLotes = async (criteria) => {
  const whereClause = {};
  
  if (criteria.variedad) {
    whereClause.variedad = criteria.variedad;
  }
  
  if (criteria.region) {
    whereClause.region = criteria.region;
  }
  
  if (criteria.estado) {
    whereClause.estado = criteria.estado;
  }
  
  if (criteria.precio_min && criteria.precio_max) {
    whereClause.precio_por_kg = {
      [Op.between]: [criteria.precio_min, criteria.precio_max]
    };
  } else if (criteria.precio_min) {
    whereClause.precio_por_kg = {
      [Op.gte]: criteria.precio_min
    };
  } else if (criteria.precio_max) {
    whereClause.precio_por_kg = {
      [Op.lte]: criteria.precio_max
    };
  }
  
  const lotes = await Lote.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'productor',
        attributes: ['id', 'name', 'lastname', 'email']
      }
    ]
  });
  
  // Convertir JSON strings a objetos
  return lotes.map(lote => {
    const loteData = lote.toJSON();
    
    if (loteData.fotos) {
      try {
        loteData.fotos = JSON.parse(loteData.fotos);
      } catch (e) {
        loteData.fotos = [];
      }
    }
    
    if (loteData.certificaciones) {
      try {
        loteData.certificaciones = JSON.parse(loteData.certificaciones);
      } catch (e) {
        loteData.certificaciones = [];
      }
    }
    
    if (loteData.atributos_sensoriales) {
      try {
        loteData.atributos_sensoriales = JSON.parse(loteData.atributos_sensoriales);
      } catch (e) {
        loteData.atributos_sensoriales = {};
      }
    }
    
    return loteData;
  });
};

module.exports = loteModel;