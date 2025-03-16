const API_BASE = 'http://localhost:2010/api';
const token = localStorage.getItem('token');

let currentConversationId = null;
let lastTargetId = null;

async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE}/users/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const userList = document.getElementById('user-list');
    if (!userList) return;
    if (data.success) {
      userList.innerHTML = '';
      data.users.forEach((user) => {
        const card = document.createElement('div');
        card.classList.add('user-card');
        card.textContent = `${user.name} ${user.lastname} (${user.email})`;
        card.addEventListener('click', () => {
          lastTargetId = user.id;
          openConversation(user.id);
        });
        userList.appendChild(card);
      });
    } else {
      userList.textContent = 'Error al cargar usuarios';
    }
  } catch (err) {
    const userList = document.getElementById('user-list');
    if (userList) userList.textContent = `Error: ${err}`;
  }
}

async function openConversation(targetId) {
  try {
    const res = await fetch(`${API_BASE}/conversations/byusers?target_id=${targetId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const conversationInfo = document.getElementById('conversation-info');
    if (data.success && data.conversation) {
      currentConversationId = data.conversation.id;
      if (conversationInfo) {
        conversationInfo.textContent = `Conversación con usuario ID: ${targetId} (Conv ID: ${currentConversationId})`;
      }
      fetchMessages();
    } else {
      if (conversationInfo) {
        conversationInfo.textContent = 'Error al obtener la conversación';
      }
    }
  } catch (err) {
    const conversationInfo = document.getElementById('conversation-info');
    if (conversationInfo) conversationInfo.textContent = `Error: ${err}`;
  }
}

async function fetchMessages() {
  if (!currentConversationId) return;
  try {
    const res = await fetch(`${API_BASE}/messages/${currentConversationId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const messageList = document.getElementById('message-list');
    if (!messageList) return;
    messageList.innerHTML = '';
    if (data.success) {
      data.messages.forEach((msg) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.textContent = `[${msg.created_at}] ${msg.text}`;
        messageList.appendChild(msgDiv);
      });
    } else {
      messageList.textContent = 'Error al cargar mensajes';
    }
  } catch (err) {
    const messageList = document.getElementById('message-list');
    if (messageList) messageList.textContent = `Error: ${err}`;
  }
}

async function sendMessage(text) {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text, conversation_id: currentConversationId })
    });
    const data = await res.json();
    const messageResult = document.getElementById('message-result');
    if (messageResult) {
      messageResult.textContent = JSON.stringify(data, null, 2);
    }
    // Limpiar campo
    const messageTextElem = document.getElementById('message-text');
    if (messageTextElem instanceof HTMLInputElement) messageTextElem.value = '';
    fetchMessages();
  } catch (err) {
    const messageResult = document.getElementById('message-result');
    if (messageResult) {
      messageResult.textContent = `Error: ${err}`;
    }
  }
}

document.getElementById('message-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const messageTextElem = document.getElementById('message-text');
  const messageText = (messageTextElem instanceof HTMLInputElement) ? messageTextElem.value : '';
  
  // Si no existe la conversación y se tiene un usuario seleccionado, intentar crearla
  if (!currentConversationId && lastTargetId) {
    await openConversation(lastTargetId);
    if (!currentConversationId) {
      const messageResult = document.getElementById('message-result');
      if (messageResult) messageResult.textContent = 'No se pudo crear la conversación. Inténtalo de nuevo.';
      return;
    }
  } else if (!currentConversationId) {
    const messageResult = document.getElementById('message-result');
    if (messageResult) messageResult.textContent = 'Selecciona un usuario para iniciar conversación.';
    return;
  }
  
  sendMessage(messageText);
});

fetchUsers();
