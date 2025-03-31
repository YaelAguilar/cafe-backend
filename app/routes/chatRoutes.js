const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const verifyToken = (req, res, next) => {
    // Lógica para verificar el token
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Verifica el token (por ejemplo, usando JWT)
        const decoded = jwt.verify(token, 'clave_secreta');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

console.log(typeof authMiddleware.verifyToken); // Debería imprimir "function"

router.use(verifyToken);

router.get('/contacts/:userId', chatController.getUserContacts);

router.get('/messages/:userId/:otherUserId', chatController.getMessagesBetweenUsers);

router.post('/messages', chatController.saveMessage);

module.exports = router;