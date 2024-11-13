const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // Permite que qualquer frontend se conecte
});

// Servir arquivos estáticos (frontend) da pasta pública
app.use(express.static('public'));

// Gerencia conexões e mensagens em salas específicas
io.on('connection', (socket) => {
  console.log('Um usuário se conectou:', socket.id);

  // Entrar em uma sala específica
  socket.on('join room', (roomID) => {
    socket.join(roomID);
    console.log(`Usuário ${socket.id} entrou na sala ${roomID}`);
  });

  // Enviar mensagem para uma sala privada
  socket.on('private message', (data) => {
    const { roomID, message } = data;
    io.to(roomID).emit('private message', message); // Envia a mensagem para todos na sala
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
