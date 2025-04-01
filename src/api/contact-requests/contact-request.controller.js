const contactRequestService = require('./contact-request.service');
const { successResponse } = require('../../utils/response-formatter');

/**
 * Crea una nueva solicitud de contacto
 */
exports.createContactRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId;
    const senderType = req.userType;
    
    const request = await contactRequestService.createContactRequest(senderId, receiverId, senderType);
    
    return res.status(201).json(successResponse(
      "Solicitud de contacto enviada exitosamente.",
      { request }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el estado de una solicitud de contacto
 */
exports.updateContactRequestStatus = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.userId;
    
    const request = await contactRequestService.updateContactRequestStatus(requestId, userId, status);
    
    return res.status(200).json(successResponse(
      `Solicitud de contacto ${status === 'accepted' ? 'aceptada' : 'rechazada'} exitosamente.`,
      { request }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las solicitudes enviadas por un usuario
 */
exports.getSentRequests = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const requests = await contactRequestService.getSentRequests(userId);
    
    return res.status(200).json(successResponse(
      "Solicitudes enviadas obtenidas exitosamente.",
      { requests }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las solicitudes recibidas por un usuario
 */
exports.getReceivedRequests = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const requests = await contactRequestService.getReceivedRequests(userId);
    
    return res.status(200).json(successResponse(
      "Solicitudes recibidas obtenidas exitosamente.",
      { requests }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene las conexiones aceptadas de un usuario
 */
exports.getConnections = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userType = req.userType;
    
    const connections = await contactRequestService.getConnections(userId, userType);
    
    return res.status(200).json(successResponse(
      "Conexiones obtenidas exitosamente.",
      { connections }
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Verifica el estado de una solicitud entre dos usuarios
 */
exports.checkContactRequestStatus = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { targetId } = req.params;
    
    const status = await contactRequestService.checkContactRequestStatus(userId, targetId);
    
    return res.status(200).json(successResponse(
      "Estado de solicitud obtenido exitosamente.",
      { status }
    ));
  } catch (error) {
    next(error);
  }
};