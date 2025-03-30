const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const fs = require("fs")

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateString = (value, minLength = 2) => {
  return typeof value === "string" && value.trim().length >= minLength
}

const validatePassword = (password, minLength = 6) => {
  return typeof password === "string" && password.length >= minLength
}

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, userType, businessName } = req.body

    if (!firstName || !lastName || !email || !password || !confirmPassword || !userType || !businessName) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
      })
    }

    // Validar formato de campos
    if (!validateString(firstName) || !validateString(lastName)) {
      return res.status(400).json({
        success: false,
        message: "El nombre y el apellido deben tener al menos 2 caracteres.",
      })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "El formato de email no es válido.",
      })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 6 caracteres.",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Las contraseñas no coinciden.",
      })
    }

    if (!["producer", "merchant"].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de usuario no válido.",
      })
    }

    // Verificar si el usuario ya existe
    const existingUser = await userModel.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "El correo electrónico ya está registrado.",
      })
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crear usuario
    const newUser = await userModel.createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      userType,
      businessName: businessName.trim(),
    })

    // Generar token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    )

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente.",
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        userType: newUser.userType,
      },
    })
  } catch (error) {
    console.error("Error en registerUser:", error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al registrar usuario.",
    })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Correo electrónico y contraseña son obligatorios.",
      })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "El formato de email no es válido.",
      })
    }

    const user = await userModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      })
    }

    const token = jwt.sign({ userId: user.id, email: user.email, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
      },
    })
  } catch (error) {
    console.error("Error en loginUser:", error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al iniciar sesión.",
    })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      })
    }

    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Error en getProfile:", error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al obtener el perfil.",
    })
  }
}

exports.getMerchantProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (req.userType !== "merchant") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Solo comerciantes pueden acceder a este recurso."
      });
    }
    
    const profile = await userModel.getMerchantProfile(userId);
    
    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error("Error en getMerchantProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al obtener el perfil de comerciante."
    });
  }
};

exports.updateMerchantProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (req.userType !== "merchant") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Solo comerciantes pueden actualizar este perfil."
      });
    }
    
    const { businessName, businessType, yearsInMarket, description, city, state, website, phone } = req.body;
    
    if (!businessName || !businessType || !description || !city || !state || !phone) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios (nombre del negocio, tipo de negocio, descripción, ciudad, estado, teléfono)."
      });
    }
    
    const validBusinessTypes = ["cafeteria", "restaurante", "distribuidor", "tostador", "otro"];
    if (!validBusinessTypes.includes(businessType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Tipo de negocio no válido."
      });
    }
    
    const profileData = {
      businessName,
      businessType,
      yearsInMarket: parseInt(yearsInMarket) || 0,
      description,
      city,
      state,
      website,
      phone
    };
    
    const updatedProfile = await userModel.updateMerchantProfile(userId, profileData);
    
    return res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente.",
      profile: updatedProfile
    });
  } catch (error) {
    console.error("Error en updateMerchantProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al actualizar el perfil de comerciante."
    });
  }
};

exports.updateMerchantSupplyNeeds = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (req.userType !== "merchant") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Solo comerciantes pueden actualizar este perfil."
      });
    }
    
    const user = await userModel.getMerchantProfile(userId);
    if (!user || !user.Merchant) {
      return res.status(404).json({
        success: false,
        message: "Perfil de comerciante no encontrado."
      });
    }
    
    const merchantId = user.Merchant.id;
    
    const { coffeeTypes, qualities, volumeRequired, purchaseFrequency, additionalRequirements } = req.body;
    
    if (!coffeeTypes || !qualities || !volumeRequired || !purchaseFrequency) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios (tipos de café, calidades, volumen requerido, frecuencia de compra)."
      });
    }
    
    if (!Array.isArray(coffeeTypes) || coffeeTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe seleccionar al menos un tipo de café."
      });
    }
    
    if (!Array.isArray(qualities) || qualities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe seleccionar al menos una calidad."
      });
    }
    
    const volume = parseInt(volumeRequired);
    if (isNaN(volume) || volume <= 0) {
      return res.status(400).json({
        success: false,
        message: "El volumen requerido debe ser un número positivo."
      });
    }
    
    const supplyData = {
      coffeeTypes,
      qualities,
      volumeRequired: volume,
      purchaseFrequency,
      additionalRequirements: additionalRequirements || ""
    };
    
    console.log("Datos a guardar:", JSON.stringify(supplyData, null, 2));
    
    const updatedSupplyNeeds = await userModel.updateMerchantSupplyNeeds(merchantId, supplyData);
    
    return res.status(200).json({
      success: true,
      message: "Necesidades de abastecimiento actualizadas exitosamente.",
      supplyNeeds: updatedSupplyNeeds
    });
  } catch (error) {
    console.error("Error en updateMerchantSupplyNeeds:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al actualizar las necesidades de abastecimiento."
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se ha proporcionado ninguna imagen."
      });
    }
    
    const cloudinary = require('../config/cloudinaryConfig');
    
    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "cafe_connect/profile_images",
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "face"
    });
    
    fs.unlinkSync(req.file.path);
    
    // Actualizar URL de imagen en el perfil del usuario
    let updatedUser;
    if (req.userType === "merchant") {
      updatedUser = await userModel.updateMerchantProfile(userId, { imageUrl: result.secure_url });
    } else if (req.userType === "producer") {
      return res.status(501).json({
        success: false,
        message: "Funcionalidad no implementada para productores."
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Tipo de usuario no válido."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Imagen de perfil actualizada exitosamente.",
      imageUrl: result.secure_url,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error en uploadProfileImage:", error);
    
    // Si hay un archivo temporal, eliminarlo
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo temporal:", unlinkError);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al subir la imagen de perfil."
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId
    const { firstName, lastName, email, password, phone, city, state, businessName } = req.body
    const updatedData = {}

    // Actualizar datos básicos del usuario
    if (firstName) {
      if (!validateString(firstName)) {
        return res.status(400).json({
          success: false,
          message: "El nombre debe tener al menos 2 caracteres.",
        })
      }
      updatedData.firstName = firstName.trim()
    }

    if (lastName) {
      if (!validateString(lastName)) {
        return res.status(400).json({
          success: false,
          message: "El apellido debe tener al menos 2 caracteres.",
        })
      }
      updatedData.lastName = lastName.trim()
    }

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "El formato de email no es válido.",
        })
      }
      const existingUser = await userModel.findByEmail(email)
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: "El email ya está en uso por otro usuario.",
        })
      }
      updatedData.email = email.trim().toLowerCase()
    }

    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: "La contraseña debe tener al menos 6 caracteres.",
        })
      }
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      updatedData.password = hashedPassword
    }

    // Actualizar usuario
    const updatedUser = await userModel.updateUser(userId, updatedData)

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente.",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error en updateProfile:", error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al actualizar el perfil.",
    })
  }
}

exports.logoutUser = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Sesión cerrada exitosamente.",
    })
  } catch (error) {
    console.error("Error en logoutUser:", error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al cerrar sesión.",
    })
  }
}

exports.listUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers()
    const filtered = users.filter((u) => u.id !== req.userId)
    return res.status(200).json({
      success: true,
      users: filtered,
    })
  } catch (error) {
    console.error("Error en listUsers:", error)
    return res.status(500).json({
      success: false,
      message: "Error en el servidor al obtener usuarios.",
    })
  }
}