const User = require('./User');

const userModel = {};

userModel.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

userModel.createUser = async (name, lastname, email, hashedPassword, type) => {
  const user = await User.create({
    name,
    lastname,
    email,
    password: hashedPassword,
    type
  });
  return user;
};

userModel.findById = async (id) => {
  return await User.findByPk(id, {
    attributes: ['id', 'name', 'lastname', 'email', 'type']
  });
};

userModel.getAllUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'name', 'lastname', 'email', 'type']
  });
};

userModel.updateUser = async (id, updatedFields) => {
  await User.update(updatedFields, { where: { id } });
  return await userModel.findById(id);
};

userModel.getUsersByType = async (type) => {
  return await User.findAll({
    where: { type },
    attributes: ['id', 'name', 'lastname', 'email', 'type']
  });
};

module.exports = userModel;