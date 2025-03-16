const API_BASE = 'http://localhost:2010/api';
const token = localStorage.getItem('token');
let currentUser = null;

// Obtener perfil del usuario
async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      console.log("Perfil obtenido:", currentUser);
    } else {
      console.error("Error al obtener perfil:", data);
    }
  } catch (error) {
    console.error("Error en fetchProfile:", error);
  }
}

// Obtener publicaciones
async function fetchPosts() {
  try {
    const res = await fetch(`${API_BASE}/posts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      displayPosts(data.data);
    } else {
      console.error("Error al obtener publicaciones:", data);
    }
  } catch (error) {
    console.error("Error en fetchPosts:", error);
  }
}

function displayPosts(posts) {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = '';
  if (posts.length === 0) {
    if (currentUser && currentUser.type === false) {
      postsList.textContent = 'No hay publicaciones. Crea tu primera publicación.';
    } else {
      postsList.textContent = 'No hay publicaciones.';
    }
    return;
  }
  posts.forEach(post => {
    const postCard = document.createElement('div');
    postCard.classList.add('post-card');
    let imagesArray = [];
    if (post.images) {
      try {
        imagesArray = JSON.parse(post.images);
      } catch (err) {
        imagesArray = [];
      }
    }
    let html = `<h3>${post.title}</h3>
                <p>${post.description}</p>
                <p><small>Publicado por usuario ID: ${post.user_id}</small></p>`;
    if (imagesArray.length > 0) {
      html += '<div class="post-images">';
      imagesArray.forEach(url => {
        html += `<img src="${url}" alt="Imagen de publicación" style="max-width: 150px; margin-right: 8px;" />`;
      });
      html += '</div>';
    }
    if (currentUser && post.user_id === currentUser.id) {
      html += `<button class="edit-post-btn" data-id="${post.id}">Editar</button>
               <button class="delete-post-btn" data-id="${post.id}">Eliminar</button>`;
    }
    postCard.innerHTML = html;
    postsList.appendChild(postCard);
  });
  
  // Añadir listeners para editar y eliminar
  document.querySelectorAll('.edit-post-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.getAttribute('data-id');
      editPost(postId);
    });
  });
  document.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.getAttribute('data-id');
      deletePost(postId);
    });
  });
}

async function createPost(title, description) {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    const imagesInput = document.getElementById('post-images');
    if (imagesInput.files.length > 0) {
      for (let i = 0; i < imagesInput.files.length; i++) {
        formData.append('images', imagesInput.files[i]);
      }
    }
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    const resultDiv = document.getElementById('create-post-result');
    resultDiv.textContent = JSON.stringify(data, null, 2);
    if (data.success) {
      fetchPosts();
    }
  } catch (error) {
    console.error("Error en createPost:", error);
  }
}

async function updatePost(postId, title, description) {
  try {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    });
    const data = await res.json();
    if (data.success) {
      fetchPosts();
    } else {
      console.error("Error al actualizar la publicación:", data);
    }
  } catch (error) {
    console.error("Error en updatePost:", error);
  }
}

async function deletePost(postId) {
  try {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      fetchPosts();
    } else {
      console.error("Error al eliminar la publicación:", data);
    }
  } catch (error) {
    console.error("Error en deletePost:", error);
  }
}

function editPost(postId) {
  const editBtn = document.querySelector(`.edit-post-btn[data-id="${postId}"]`);
  if (!editBtn) return;
  const postCard = editBtn.parentElement;
  const currentTitle = postCard.querySelector('h3').textContent;
  const currentDescription = postCard.querySelector('p').textContent;
  const form = document.createElement('form');
  form.innerHTML = `
    <input type="text" name="title" value="${currentTitle}" required>
    <textarea name="description" required>${currentDescription}</textarea>
    <button type="submit">Guardar</button>
    <button type="button" class="cancel-edit-btn">Cancelar</button>
  `;
  postCard.innerHTML = '';
  postCard.appendChild(form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTitle = form.elements.title.value;
    const newDescription = form.elements.description.value;
    await updatePost(postId, newTitle, newDescription);
  });
  form.querySelector('.cancel-edit-btn').addEventListener('click', () => {
    fetchPosts();
  });
}

document.getElementById('create-post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titleElem = document.getElementById('post-title');
  const descElem = document.getElementById('post-description');
  const title = titleElem.value;
  const description = descElem.value;
  await createPost(title, description);
  // Limpiar campos
  titleElem.value = '';
  descElem.value = '';
  document.getElementById('post-images').value = '';
});

async function initPosts() {
  await fetchProfile();
  if (currentUser && currentUser.type === false) {
    document.getElementById('create-post-container').style.display = 'block';
  } else {
    document.getElementById('create-post-container').style.display = 'none';
  }
  fetchPosts();
}

initPosts();
