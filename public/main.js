const socket = io();
const clientsTotal = document.getElementById('client-total');

const messageContainer = document.getElementById('message-container');
const feedbackBar = document.getElementById('feedback-bar');
const nameInput = document.getElementById('name-input');
const editNameBtn = document.getElementById('edit-name-btn');
const muteBtn = document.getElementById('mute-btn');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('/src/som-mensagem.mp3');

let confirmedName = nameInput.value;

// Mutar som
let isMuted = localStorage.getItem('chat-muted') === 'true';
applyMuteState();

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    localStorage.setItem('chat-muted', isMuted);
    applyMuteState();
});

function applyMuteState() {
    const icon = muteBtn.querySelector('i');
    if (isMuted) {
        icon.className = 'fas fa-volume-xmark';
        muteBtn.title = 'Ativar notificações';
        muteBtn.classList.add('muted');
    } else {
        icon.className = 'fas fa-volume-high';
        muteBtn.title = 'Silenciar notificações';
        muteBtn.classList.remove('muted');
    }
}

// Edição de nome 
editNameBtn.addEventListener('click', () => {
    const isEditing = !nameInput.readOnly;

    if (isEditing) {
        confirmedName = nameInput.value.trim() || confirmedName;
        nameInput.value = confirmedName;
        lockNameInput();
        messageInput.focus();
    } else {
        nameInput.readOnly = false;
        nameInput.classList.add('name-editing');
        editNameBtn.querySelector('i').className = 'fas fa-check';
        editNameBtn.title = 'Confirmar nome';
        nameInput.focus();
        nameInput.select();
    }
});

function lockNameInput() {
    nameInput.readOnly = true;
    nameInput.classList.remove('name-editing');
    editNameBtn.querySelector('i').className = 'fas fa-pen';
    editNameBtn.title = 'Editar nome';
}

nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !nameInput.readOnly) {
        e.preventDefault();
        editNameBtn.click();
    }
});


messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total de usuários: ${data}`
});

function sendMessage() {
    if (messageInput.value === '') return;

    // Se ainda estiver editando o nome, descarta a alteração e bloqueia
    if (!nameInput.readOnly) {
        nameInput.value = confirmedName;
        lockNameInput();
    }

    const data = {
        name: confirmedName,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    if (!isMuted) messageTone.play();
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const formattedDate = moment(data.dateTime).locale('pt-br').format('DD/MM/YYYY HH:mm');
    const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
        <div class="message-bubble">
            <span class="message-name">${data.name}</span>
            <p class="message-text">${data.message}</p>
            <span class="message-time">${formattedDate}</span>
        </div>
    </li>
    `
    messageContainer.insertAdjacentHTML('beforeend', element);
    scrollToBotton();
}

function scrollToBotton() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} está digitando...`
    });
});

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} está digitando...`
    });
});

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: '',
    });
});

socket.on('feedback', (data) => {
    clearFeedback();
    const element = `
        <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
    `
    if (data.feedback) messageContainer.insertAdjacentHTML('beforeend', element);
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    })
}







