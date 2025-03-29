const jwt = require('jsonwebtoken');
const messageModel = require('../models/messageModel');
const conversationModel = require('../models/conversationModel');
const userModel = require('../models/userModel');

// Almacenar usuarios conectados: { userId: socketId }
const connectedUsers = {};

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      // Autenticar usuario mediante token
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      socket.userType = decoded.userType;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Registrar usuario conectado
    connectedUsers[socket.userId] = socket.id;
    
    // Emitir lista de usuarios conectados
    io.emit('userStatus', Object.keys(connectedUsers));

    // Unirse a salas para sus conversaciones
    joinUserRooms(socket);

    // Manejar nuevo mensaje
    socket.on('sendMessage', async (data) => {
      try {
        const { text, conversation_id, target_user_id } = data;
        
        if (!text) {
          return socket.emit('error', { message: 'El mensaje no puede estar vacío' });
        }
        
        let conversationId = conversation_id;
        
        // Si no hay ID de conversación pero sí hay ID de usuario destino, buscar o crear conversación
        if (!conversationId && target_user_id) {
          const userA = Math.min(socket.userId, target_user_id);
          const userB = Math.max(socket.userId, target_user_id);
          
          let conversation = await conversationModel.findByUsers(userA, userB);
          if (!conversation) {
            conversation = await conversationModel.createConversation(userA, userB);
            
            // Unir al usuario a la nueva sala de conversación
            socket.join(`conversation_${conversation.id}`);
          }
          
          conversationId = conversation.id;
        }
        
        if (!conversationId) {
          return socket.emit('error', { message: 'Se requiere ID de conversación o ID de usuario destino' });
        }
        
        // Guardar mensaje en la base de datos
        const newMessage = await messageModel.createMessage(text, socket.userId, conversationId);
        
        // Obtener información del remitente para incluirla en la respuesta
        const sender = await userModel.findById(socket.userId);
        
        const messageData = {
          ...newMessage.dataValues,
          sender: {
            id: sender.id,
            name: sender.name,
            lastname: sender.lastname
          }
        };
        
        // Emitir mensaje a todos los usuarios en la sala de la conversación
        io.to(`conversation_${conversationId}`).emit('newMessage', messageData);
        
        // Notificar al destinatario si está conectado pero no en la sala
        const conversation = await conversationModel.findById(conversationId);
        const recipientId = conversation.user1_id === socket.userId ? conversation.user2_id : conversation.user1_id;
        
        if (connectedUsers[recipientId]) {
          io.to(connectedUsers[recipientId]).emit('messageNotification', {
            conversation_id: conversationId,
            sender: {
              id: sender.id,
              name: sender.name,
              lastname: sender.lastname
            }
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Error al enviar mensaje' });
      }
    });

    // Manejar escritura en curso
    socket.on('typing', (data) => {
      const { conversation_id, isTyping } = data;
      
      if (!conversation_id) return;
      
      socket.to(`conversation_${conversation_id}`).emit('userTyping', {
        user_id: socket.userId,
        isTyping
      });
    });

    // Manejar lectura de mensajes
    socket.on('markAsRead', async (data) => {
      try {
        const { conversation_id } = data;
        
        if (!conversation_id) return;
        
        // Aquí implementaríamos la lógica para marcar mensajes como leídos
        // Por ahora, solo notificamos a los demás usuarios
        socket.to(`conversation_${conversation_id}`).emit('messagesRead', {
          user_id: socket.userId,
          conversation_id
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      // Eliminar usuario de la lista de conectados
      delete connectedUsers[socket.userId];
      
      // Notificar a todos los usuarios
      io.emit('userStatus', Object.keys(connectedUsers));
    });
  });

  // Función para unir al usuario a las salas de sus conversaciones
  async function joinUserRooms(socket) {
    try {
      // Obtener todas las conversaciones del usuario
      const conversations = await conversationModel.findByUserId(socket.userId);
      
      // Unir al usuario a cada sala de conversación
      conversations.forEach(conversation => {
        socket.join(`conversation_${conversation.id}`);
      });
    } catch (error) {
      console.error('Error joining user rooms:', error);
    }
  }
};