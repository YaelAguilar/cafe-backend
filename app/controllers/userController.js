const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateString = (value, minLength = 2) => {
  return typeof value === 'string' && value.trim().length >= minLength;
};

const validatePassword = (password, minLength = 6) => {
  return typeof password === 'string' && password.length >= minLength;
};

exports.registerUser = async (req, res) => {
  try {
    const { name, lastname, email, password, type } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios.'
      });
    }

    if (!validateString(name) || !validateString(lastname)) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y el apellido deben tener al menos 2 caracteres.'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato de email no es válido.'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario ya está registrado.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.createUser(
      name.trim(),
      lastname.trim(),
      email.trim(),
      hashedPassword,
      type || 0
    );

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al registrar usuario.'
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios.'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato de email no es válido.'
      });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (usuario no encontrado).'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (contraseña incorrecta).'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al iniciar sesión.'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Perfil de usuario obtenido correctamente.',
      user
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener el perfil.'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, lastname, email, password } = req.body;
    let updatedData = {};

    if (name) {
      if (!validateString(name)) {
        return res.status(400).json({
          success: false,
          message: 'El nombre debe tener al menos 2 caracteres.'
        });
      }
      updatedData.name = name.trim();
    }

    if (lastname) {
      if (!validateString(lastname)) {
        return res.status(400).json({
          success: false,
          message: 'El apellido debe tener al menos 2 caracteres.'
        });
      }
      updatedData.lastname = lastname.trim();
    }

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'El formato de email no es válido.'
        });
      }
      const existingUser = await userModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está en uso por otro usuario.'
        });
      }
      updatedData.email = email.trim();
    }

    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres.'
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar.'
      });
    }

    const updatedUser = await userModel.updateUser(userId, updatedData);

    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al actualizar el perfil.'
    });
  }
};

exports.logoutUser = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Sesión cerrada exitosamente. Elimina el token en tu cliente.'
    });
  } catch (error) {
    console.error('Error en logoutUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al cerrar sesión.'
    });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const filtered = users.filter(u => u.id !== req.userId);
    return res.status(200).json({
      success: true,
      users: filtered
    });
  } catch (error) {
    console.error('Error en listUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener usuarios.'
    });
  }
};
