const Post = require('./Post');

const postModel = {};

postModel.createPost = async (title, description, user_id) => {
  return await Post.create({ title, description, user_id });
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
  await Post.update(updatedFields, { where: { id } });
  return await postModel.getPostById(id);
};

postModel.deletePost = async (id) => {
  return await Post.destroy({ where: { id } });
};

module.exports = postModel;
