const postModel = require('../models/postModel');
const cloudinary = require('../config/cloudinaryConfig');

exports.createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const userType = req.userType;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios (title, description).'
      });
    }

    // Solo productores
    if (userType !== false) {
      return res.status(403).json({
        success: false,
        message: 'Solo los productores (type=false) pueden crear publicaciones.'
      });
    }

    let imagesArray = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const base64String = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64String}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'proyecto_cafe/posts'
        });
        imagesArray.push(uploadResponse.secure_url);
      }
    }

    const newPost = await postModel.createPost(
      title.trim(),
      description.trim(),
      userId,
      imagesArray
    );

    return res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente.',
      data: newPost
    });
  } catch (error) {
    console.error('Error en createPost:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al crear la publicación.'
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    return res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error en getAllPosts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener publicaciones.'
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada.'
      });
    }

    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error en getPostById:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener la publicación.'
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description } = req.body;

    const post = await postModel.getPostById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada.'
      });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar esta publicación.'
      });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title.trim();
    if (description) updatedFields.description = description.trim();

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar.'
      });
    }

    const updatedPost = await postModel.updatePost(id, updatedFields);

    return res.status(200).json({
      success: true,
      message: 'Publicación actualizada exitosamente.',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error en updatePost:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al actualizar la publicación.'
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await postModel.getPostById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada.'
      });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta publicación.'
      });
    }

    await postModel.deletePost(id);

    return res.status(200).json({
      success: true,
      message: 'Publicación eliminada exitosamente.'
    });
  } catch (error) {
    console.error('Error en deletePost:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al eliminar la publicación.'
    });
  }
};
