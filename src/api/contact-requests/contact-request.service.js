const { ContactRequest, User, Producer, Merchant } = require("../../models");
const { NotFoundError, BadRequestError, ConflictError } = require("../../utils/error-types");

/**
 * Crea una nueva solicitud de contacto
 */
const createContactRequest = async (senderId, receiverId, senderType) => {
  // Verificar que el remitente existe
  const sender = await User.findByPk(senderId);
  if (!sender) {
    throw new NotFoundError("Usuario remitente no encontrado.");
  }

  // Verificar que el destinatario existe
  const receiver = await User.findByPk(receiverId);
  if (!receiver) {
    throw new NotFoundError("Usuario destinatario no encontrado.");
  }

  // Verificar que el tipo de remitente es correcto
  if (sender.userType !== senderType) {
    throw new BadRequestError("Tipo de remitente incorrecto.");
  }

  // Verificar que el remitente y el destinatario son de tipos diferentes
  if (sender.userType === receiver.userType) {
    throw new BadRequestError("No se puede enviar solicitud a un usuario del mismo tipo.");
  }

  // Verificar si ya existe una solicitud pendiente entre estos usuarios
  const existingRequest = await ContactRequest.findOne({
    where: {
      senderId,
      receiverId,
      status: "pending",
    },
  });

  if (existingRequest) {
    throw new ConflictError("Ya existe una solicitud pendiente para este usuario.");
  }

  // Verificar si ya existe una solicitud aceptada entre estos usuarios
  const existingAccepted = await ContactRequest.findOne({
    where: {
      senderId,
      receiverId,
      status: "accepted",
    },
  });

  if (existingAccepted) {
    throw new ConflictError("Ya estás conectado con este usuario.");
  }

  // Crear la solicitud
  return await ContactRequest.create({
    senderId,
    receiverId,
    senderType,
    status: "pending",
  });
};

/**
 * Actualiza el estado de una solicitud de contacto
 */
const updateContactRequestStatus = async (requestId, userId, status) => {
  const request = await ContactRequest.findByPk(requestId);
  
  if (!request) {
    throw new NotFoundError("Solicitud no encontrada.");
  }

  // Verificar que el usuario es el destinatario de la solicitud
  if (request.receiverId !== userId) {
    throw new BadRequestError("No tienes permiso para actualizar esta solicitud.");
  }

  // Verificar que el estado es válido
  if (!["accepted", "rejected"].includes(status)) {
    throw new BadRequestError("Estado no válido.");
  }

  // Actualizar el estado
  await request.update({ status });

  return request;
};

/**
 * Obtiene las solicitudes enviadas por un usuario
 */
const getSentRequests = async (userId) => {
  return await ContactRequest.findAll({
    where: { senderId: userId },
    include: [
      {
        model: User,
        as: "Receiver",
        attributes: ["id", "firstName", "lastName", "email", "userType"],
        include: [
          { model: Producer },
          { model: Merchant }
        ]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};

/**
 * Obtiene las solicitudes recibidas por un usuario
 */
const getReceivedRequests = async (userId) => {
  return await ContactRequest.findAll({
    where: { receiverId: userId },
    include: [
      {
        model: User,
        as: "Sender",
        attributes: ["id", "firstName", "lastName", "email", "userType"],
        include: [
          { model: Producer },
          { model: Merchant }
        ]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};

/**
 * Obtiene las conexiones aceptadas de un usuario
 */
const getConnections = async (userId, userType) => {
  const connections = [];
  
  // Obtener conexiones donde el usuario es el remitente
  const sentConnections = await ContactRequest.findAll({
    where: { 
      senderId: userId,
      status: "accepted"
    },
    include: [
      {
        model: User,
        as: "Receiver",
        attributes: ["id", "firstName", "lastName", "email", "userType"],
        include: [
          { model: Producer },
          { model: Merchant }
        ]
      }
    ]
  });
  
  // Obtener conexiones donde el usuario es el destinatario
  const receivedConnections = await ContactRequest.findAll({
    where: { 
      receiverId: userId,
      status: "accepted"
    },
    include: [
      {
        model: User,
        as: "Sender",
        attributes: ["id", "firstName", "lastName", "email", "userType"],
        include: [
          { model: Producer },
          { model: Merchant }
        ]
      }
    ]
  });
  
  // Procesar conexiones enviadas
  for (const conn of sentConnections) {
    connections.push({
      id: conn.id,
      user: conn.Receiver,
      createdAt: conn.createdAt
    });
  }
  
  // Procesar conexiones recibidas
  for (const conn of receivedConnections) {
    connections.push({
      id: conn.id,
      user: conn.Sender,
      createdAt: conn.createdAt
    });
  }
  
  return connections;
};

/**
 * Verifica si existe una solicitud entre dos usuarios
 */
const checkContactRequestStatus = async (userId, targetId) => {
  // Buscar solicitud donde el usuario es el remitente
  const sentRequest = await ContactRequest.findOne({
    where: {
      senderId: userId,
      receiverId: targetId
    }
  });
  
  if (sentRequest) {
    return {
      exists: true,
      status: sentRequest.status,
      direction: "sent",
      id: sentRequest.id
    };
  }
  
  // Buscar solicitud donde el usuario es el destinatario
  const receivedRequest = await ContactRequest.findOne({
    where: {
      senderId: targetId,
      receiverId: userId
    }
  });
  
  if (receivedRequest) {
    return {
      exists: true,
      status: receivedRequest.status,
      direction: "received",
      id: receivedRequest.id
    };
  }
  
  return {
    exists: false
  };
};

module.exports = {
  createContactRequest,
  updateContactRequestStatus,
  getSentRequests,
  getReceivedRequests,
  getConnections,
  checkContactRequestStatus
};