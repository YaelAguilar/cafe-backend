const Perfil = require('./Perfil');
const User = require('./User');

const perfilModel = {};

perfilModel.createPerfil = async (usuario_id, perfilData = {}) => {
  // Convertir objetos a JSON strings
  if (perfilData.redes_sociales && typeof perfilData.redes_sociales === 'object') {
    perfilData.redes_sociales = JSON.stringify(perfilData.redes_sociales);
  }
  if (perfilData.certificaciones && Array.isArray(perfilData.certificaciones)) {
    perfilData.certificaciones = JSON.stringify(perfilData.certificaciones);
  }
  
  return await Perfil.create({
    usuario_id,
    ...perfilData
  });
};

perfilModel.getPerfilByUsuarioId = async (usuario_id) => {
  const perfil = await Perfil.findOne({
    where: { usuario_id },
    include: [
      {
        model: User,
        as: 'usuario',
        attributes: ['id', 'name', 'lastname', 'email', 'type']
      }
    ]
  });
  
  if (!perfil) return null;
  
  const perfilData = perfil.toJSON();
  
  // Convertir JSON strings a objetos
  if (perfilData.redes_sociales) {
    try {
      perfilData.redes_sociales = JSON.parse(perfilData.redes_sociales);
    } catch (e) {
      perfilData.redes_sociales = {};
    }
  }
  
  if (perfilData.certificaciones) {
    try {
      perfilData.certificaciones = JSON.parse(perfilData.certificaciones);
    } catch (e) {
      perfilData.certificaciones = [];
    }
  }
  
  return perfilData;
};

perfilModel.updatePerfil = async (usuario_id, updatedFields) => {
  // Convertir objetos a JSON strings
  if (updatedFields.redes_sociales && typeof updatedFields.redes_sociales === 'object') {
    updatedFields.redes_sociales = JSON.stringify(updatedFields.redes_sociales);
  }
  if (updatedFields.certificaciones && Array.isArray(updatedFields.certificaciones)) {
    updatedFields.certificaciones = JSON.stringify(updatedFields.certificaciones);
  }
  
  await Perfil.update(updatedFields, { where: { usuario_id } });
  return await perfilModel.getPerfilByUsuarioId(usuario_id);
};

perfilModel.getOrCreatePerfil = async (usuario_id) => {
  let perfil = await perfilModel.getPerfilByUsuarioId(usuario_id);
  
  if (!perfil) {
    perfil = await perfilModel.createPerfil(usuario_id);
    perfil = await perfilModel.getPerfilByUsuarioId(usuario_id);
  }
  
  return perfil;
};

module.exports = perfilModel;