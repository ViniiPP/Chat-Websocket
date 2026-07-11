import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

/**
 * ES Modules não disponibilizam __dirname e __filename
 * Esses valores são reconstruídos para utilizar
 * caminhos relativos de forma consistente em qualquer ambiente
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Arquivos estáticos registrados ANTES de iniciar o servidor
*/
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

/**
 * O servidor HTTP é compartilhado entre o Express e o Socket.IO
 * Isso permite servir a aplicação web e manter conexões WebSocket utilizando a mesma porta
*/
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
});

server.listen(PORT, () => console.log(`Server iniciou na porta ${PORT}`));

let socketsConnected = new Set();

/**
 * Registra o handler responsável pelo ciclo de vida de cada conexão.
*/
io.on('connection', onConnected);

/**
 * Executada sempre que um cliente estabelece uma conexão WebSocket
*/
function onConnected(socket) {
    console.log(socket.id);
    socketsConnected.add(socket.id);

    /**
     * Publica o número atualizado de clientes para todos os navegadores conectados
    */
    io.emit('clients-total', socketsConnected.size);

    /**
     * O evento disconnect é disparado automaticamente pelo Socket.IO
     * independentemente do motivo da desconexão
    */
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}