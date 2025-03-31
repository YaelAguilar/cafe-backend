const Chat = require('../models/chat');
const { Sequelize, Op } = require('sequelize');
const User = require('../models/User'); // Ajusta según tu modelo de usuario
const MatchCompras = require('../models/MerchantSupplyNeeds'); // Ajusta según tu modelo de matches

const chatController = {
  // Obtener mensajes entre dos usuarios
  getMessagesBetweenUsers: async (req, res) => {
    try {
      const { userId, otherUserId } = req.params;
      
      // Verificar si existe un match aceptado
      const match = await MatchCompras.findOne({
        where: {
          [Op.or]: [
            { id_comercializador: userId, id_productor: otherUserId },
            { id_comercializador: otherUserId, id_productor: userId }
          ],
          estado_match: 'aceptado' // Solo si el match está aceptado
        }
      });

      if (!match) {
        return res.status(403).json({ message: 'No existe un match o el match no está aceptado' });
      }

      // Obtener mensajes
      const messages = await Chat.findAll({
        where: {
          [Op.or]: [
            { id_remitente: userId, id_destinatario: otherUserId },
            { id_remitente: otherUserId, id_destinatario: userId }
          ]
        },
        order: [['fecha', 'ASC']]
      });

      // Marcar mensajes como leídos
      await Chat.update(
        { leido: true },
        {
          where: {
            id_remitente: otherUserId,
            id_destinatario: userId,
            leido: false
          }
        }
      );

      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  },

  // Obtener todos los contactos (usuarios con matches aceptados)
  getUserContacts: async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Buscar todos los usuarios con matches aceptados
      const matches = await MatchCompras.findAll({
        where: {
          [Op.or]: [
            { id_comercializador: userId },
            { id_productor: userId }
          ],
          estado_match: 'aceptado'
        }
      });

      // Si no hay matches, devolver array vacío
      if (!matches || matches.length === 0) {
        return res.status(200).json([]);
      }

      // Obtener IDs de los usuarios con match (el otro usuario, no el actual)
      const contactUserIds = matches.map(match => {
        return match.id_comercializador.toString() === userId.toString() 
          ? match.id_productor 
          : match.id_comercializador;
      });

      // Obtener información de los usuarios
      const users = await User.findAll({
        where: {
          id_usuario: {
            [Op.in]: contactUserIds
          }
        },
        attributes: ['id_usuario', 'nombre', 'apellido', 'email', 'tipo'] // Ajusta según tu modelo
      });

      // Crear lista de contactos con información adicional
      const contacts = [];
      
      for (const user of users) {
        // Buscar el match correspondiente
        const match = matches.find(m => 
          m.id_comercializador.toString() === user.id_usuario.toString() || 
          m.id_productor.toString() === user.id_usuario.toString()
        );
        
        // Obtener último mensaje
        const lastMessage = await Chat.findOne({
          where: {
            [Op.or]: [
              { id_remitente: userId, id_destinatario: user.id_usuario },
              { id_remitente: user.id_usuario, id_destinatario: userId }
            ]
          },
          order: [['fecha', 'DESC']]
        });
        
        // Obtener cantidad de mensajes no leídos
        const unreadCount = await Chat.count({
          where: {
            id_remitente: user.id_usuario,
            id_destinatario: userId,
            leido: false
          }
        });
        
        // Construir objeto de contacto
        contacts.push({
          id: user.id_usuario,
          name: `${user.nombre} ${user.apellido || ''}`.trim(),
          avatar: '/api/placeholder/100/100', // Placeholder para avatar
          tipo: user.tipo,
          lastMessage: lastMessage ? lastMessage.mensaje : '',
          time: lastMessage ? lastMessage.fecha : null,
          unread: unreadCount,
          online: false, // Se actualizará vía WebSocket
          match_id: match.id_match
        });
      }

      return res.status(200).json(contacts);
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  },

  // Guardar un nuevo mensaje
  saveMessage: async (req, res) => {
    try {
      const { senderId, receiverId, message } = req.body;
      
      // Verificar si existe un match aceptado
      const match = await MatchCompras.findOne({
        where: {
          [Op.or]: [
            { id_comercializador: senderId, id_productor: receiverId },
            { id_comercializador: receiverId, id_productor: senderId }
          ],
          estado_match: 'aceptado' // Solo si el match está aceptado
        }
      });

      if (!match) {
        return res.status(403).json({ message: 'No existe un match o el match no está aceptado' });
      }

      // Crear el mensaje
      const newMessage = await Chat.create({
        id_remitente: senderId,
        id_destinatario: receiverId,
        mensaje: message,
        fecha: new Date(),
        leido: false
      });

      return res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
};

module.exports = chatController;