const Post = require('./Post');

const postModel = {};

postModel.createPost = async (title, description, user_id, imagesArray = []) => {
  const imagesJSON = JSON.stringify(imagesArray);
  return await Post.create({ title, description, user_id, images: imagesJSON });
};

postModel.getAllPosts = async () => {
  return await Post.findAll({
    order: [['id', 'DESC']]
  });
};

postModel.getPostById = async (id) => {
  return await Post.findByPk(id);
};

postModel.updatePost = async (id, updatedFields) => {
  if (updatedFields.images && Array.isArray(updatedFields.images)) {
    updatedFields.images = JSON.stringify(updatedFields.images);
  }
  await Post.update(updatedFields, { where: { id } });
  return await postModel.getPostById(id);
};

postModel.deletePost = async (id) => {
  return await Post.destroy({ where: { id } });
};

module.exports = postModel;
