const { Op } = require("sequelize")
const User = require("./User")
const Merchant = require("./Merchant")
const Producer = require("./Producer")
const MerchantSupplyNeeds = require("./MerchantSupplyNeeds")

exports.findByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } })
  } catch (error) {
    console.error("Error en findByEmail:", error)
    throw error
  }
}

exports.findById = async (id, options = {}) => {
  try {
    // Logs para depuración
    console.log("Buscando usuario con ID:", id)
    console.log("Opciones de búsqueda:", JSON.stringify(options))

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      ...(options || {}),
    })

    console.log("Usuario encontrado:", user ? "Sí" : "No")
    return user
  } catch (error) {
    console.error("Error en findById:", error)
    throw error
  }
}

exports.createUser = async (userData) => {
  try {
    const { businessName, ...userInfo } = userData
    const user = await User.create(userInfo)

    if (userData.userType === "merchant") {
      await Merchant.create({
        userId: user.id,
        businessName,
      })
    } else if (userData.userType === "producer") {
      await Producer.create({
        userId: user.id,
        businessName,
      })
    }

    return user
  } catch (error) {
    console.error("Error en createUser:", error)
    throw error
  }
}

exports.updateUser = async (id, userData) => {
  try {
    await User.update(userData, { where: { id } })
    return await this.findById(id)
  } catch (error) {
    console.error("Error en updateUser:", error)
    throw error
  }
}

exports.getAllUsers = async () => {
  try {
    return await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Merchant, // Importado arriba
          // as: 'Merchant', // si definiste un alias, se incluye
          required: false, // para que incluya también usuarios que no tengan merchant
        },
      ],
    })
  } catch (error) {
    console.error("Error en getAllUsers:", error)
    throw error
  }
}

exports.getMerchantProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Merchant,
          include: [{ model: MerchantSupplyNeeds, as: "MerchantSupplyNeeds" }],
        },
      ],
    })

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    return user
  } catch (error) {
    console.error("Error en getMerchantProfile:", error)
    throw error
  }
}

exports.getProducerProfile = async (userId) => {
  try {
    console.log("Obteniendo perfil de productor para userId:", userId)

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [{ model: Producer }],
    })

    if (!user) {
      console.log("Usuario no encontrado")
      throw new Error("Usuario no encontrado")
    }

    if (!user.Producer) {
      console.log("Perfil de productor no encontrado")
      throw new Error("Perfil de productor no encontrado")
    }

    console.log("Perfil de productor encontrado:", user.Producer.id)
    return user
  } catch (error) {
    console.error("Error en getProducerProfile:", error)
    throw error
  }
}

exports.updateMerchantProfile = async (userId, profileData) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Merchant }],
    })

    if (!user || !user.Merchant) {
      throw new Error("Usuario o perfil de comerciante no encontrado")
    }

    const merchantId = user.Merchant.id

    await Merchant.update(profileData, {
      where: { id: merchantId },
    })

    return await this.getMerchantProfile(userId)
  } catch (error) {
    console.error("Error en updateMerchantProfile:", error)
    throw error
  }
}

exports.updateProducerProfile = async (userId, profileData) => {
  try {
    console.log("Actualizando perfil de productor para userId:", userId)
    console.log("Datos a actualizar:", profileData)

    const user = await User.findByPk(userId, {
      include: [{ model: Producer }],
    })

    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    if (!user.Producer) {
      console.log("Creando nuevo perfil de productor")
      await Producer.create({
        userId: user.id,
        ...profileData,
      })
    } else {
      console.log("Actualizando perfil de productor existente")
      await Producer.update(profileData, {
        where: { userId },
      })
    }

    return await this.getProducerProfile(userId)
  } catch (error) {
    console.error("Error en updateProducerProfile:", error)
    throw error
  }
}

exports.updateMerchantSupplyNeeds = async (merchantId, supplyData) => {
  try {
    const existingNeeds = await MerchantSupplyNeeds.findOne({
      where: { merchantId },
    })

    if (existingNeeds) {
      await MerchantSupplyNeeds.update(supplyData, {
        where: { merchantId },
      })
    } else {
      await MerchantSupplyNeeds.create({
        ...supplyData,
        merchantId,
      })
    }

    return await MerchantSupplyNeeds.findOne({
      where: { merchantId },
    })
  } catch (error) {
    console.error("Error en updateMerchantSupplyNeeds:", error)
    throw error
  }
}

exports.getProviders = async () => {
  try {
    return await User.findAll({
      where: { userType: "producer" },
      attributes: { exclude: ["password"] },
      include: [{ model: Producer }],
    });
  } catch (error) {
    console.error("Error en getProviders:", error);
    throw error;
  }
};

exports.listMerchants = async (req, res) => {
  try {
    // Llamas a una función que traiga todos los merchants con su User
    const merchants = await userModel.getAllMerchants();
    return res.status(200).json({
      success: true,
      merchants,
    });
  } catch (error) {
    console.error("Error en listMerchants:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener la lista de comerciantes.",
    });
  }
};

exports.getAllMerchants = async () => {
  try {
    return await Merchant.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
      ],
    });
  } catch (error) {
    console.error("Error en getAllMerchants:", error);
    throw error;
  }
};
