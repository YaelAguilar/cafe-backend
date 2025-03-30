const { Op } = require("sequelize")
const User = require("./User")
const Merchant = require("./Merchant")
const Producer = require("./Producer")
const MerchantSupplyNeeds = require("./MerchantSupplyNeeds")

exports.findByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    console.error("Error en findByEmail:", error);
    throw error;
  }
};

exports.findById = async (id) => {
  try {
    return await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
  } catch (error) {
    console.error("Error en findById:", error);
    throw error;
  }
};

exports.createUser = async (userData) => {
  try {
    const { businessName, ...userInfo } = userData;
    const user = await User.create(userInfo);

    if (userData.userType === "merchant") {
      await Merchant.create({
        userId: user.id,
        businessName,
      });
    } else if (userData.userType === "producer") {
      await Producer.create({
        userId: user.id,
        businessName,
      });
    }

    return user;
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
};

exports.updateUser = async (id, userData) => {
  try {
    await User.update(userData, { where: { id } });
    return await this.findById(id);
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    return await User.findAll({
      attributes: { exclude: ["password"] },
    });
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    throw error;
  }
};

exports.getMerchantProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Merchant,
          include: [{ model: MerchantSupplyNeeds, as: "MerchantSupplyNeeds" }]
        },
      ],
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  } catch (error) {
    console.error("Error en getMerchantProfile:", error);
    throw error;
  }
};

exports.updateMerchantProfile = async (userId, profileData) => {
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: Merchant }]
    });
    
    if (!user || !user.Merchant) {
      throw new Error("Usuario o perfil de comerciante no encontrado");
    }
    
    const merchantId = user.Merchant.id;
    
    await Merchant.update(profileData, {
      where: { id: merchantId }
    });
    
    return await this.getMerchantProfile(userId);
  } catch (error) {
    console.error("Error en updateMerchantProfile:", error);
    throw error;
  }
};

exports.updateMerchantSupplyNeeds = async (merchantId, supplyData) => {
  try {
    const existingNeeds = await MerchantSupplyNeeds.findOne({
      where: { merchantId }
    });
    
    if (existingNeeds) {
      await MerchantSupplyNeeds.update(supplyData, {
        where: { merchantId }
      });
    } else {
      await MerchantSupplyNeeds.create({
        ...supplyData,
        merchantId
      });
    }
    
    return await MerchantSupplyNeeds.findOne({
      where: { merchantId }
    });
  } catch (error) {
    console.error("Error en updateMerchantSupplyNeeds:", error);
    throw error;
  }
};