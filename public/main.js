const socket = io();
const clientsTotal = document.getElementById('client-total');

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total de usuários: ${data}`
});









