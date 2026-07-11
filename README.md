# Chat-Websocket

- Aplicacao de chat em tempo real baseada em WebSocket, construida com Socket.IO e Express
- Render: https://chat-websocket-rr3f.onrender.com/

## Stack

- **Backend:** Node.js, Express 5, Socket.IO 4
- **Frontend:** HTML5, CSS3, JavaScript
- **Dependencias:** Moment.js (timestamps relativos), Font Awesome (icones)

## Funcionalidades

- Mensagens em tempo real com entrega via WebSocket
- Indicacao de usuarios conectados (atualizada em broadcast)
- Indicador de digitacao por usuario
- Notificacao sonora ao receber mensagem
- Timestamp relativo via Moment.js
- Nome de usuario customizavel

## Instalacao

```bash
npm install
```

## Uso

**Desenvolvimento (com live-reload via nodemon):**

```bash
npm run dev
```

**Producao:**

```bash
npm start
```

O servidor inicia na porta `4000` por padrao. Defina a variavel de ambiente `PORT` para alterar a porta.

## Estrutura do Projeto

```
Chat-Websocket/
  app.js              -- Servidor HTTP + Socket.IO (ponto de entrada)
  package.json
  public/
    index.html        -- Interface do chat
    style.css         -- Estilos
    main.js           -- Logica do cliente Socket.IO
```

## Arquitetura

Cada cliente conecta-se ao servidor via Socket.IO. O servidor mantem um `Set` com os IDs dos sockets ativos e propaga eventos para todos os clientes conectados.

Fluxo basico de uma mensagem:

1. Cliente A emite `message` com `{ name, message, dateTime }`
2. Servidor recebe o evento e faz `broadcast.emit('chat-message', data)` para os demais clientes
3. Cliente B recebe `chat-message` e renderiza a mensagem na interface

O servidor nao persiste mensagens -- todo o estado e volatel e mantido apenas em memoria durante a sessao.

## Eventos Socket.IO

| Evento | Direcao | Descricao |
|---|---|---|
| `clients-total` | servidor -> cliente | Numero de usuarios conectados |
| `message` | cliente -> servidor | Mensagem enviada pelo usuario |
| `chat-message` | servidor -> cliente | Mensagem encaminhada para os demais clientes |
| `feedback` | bidirecional | Indicador de digitacao |
| `disconnect` | cliente -> servidor | Disparado automaticamente ao desconectar |

## Licenca

ISC
