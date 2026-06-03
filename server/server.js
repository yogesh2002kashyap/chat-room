const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials:true,
  },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials:true, }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Chat server running 🚀' });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join a room
  socket.on('join-chat', ({ username, room}) => {
    socket.username = username;
    socket.room = room;

    socket.join(room);

    console.log(`${username} joined ${socket.room}`);
  });

  // Receive message and broadcast to ALL with username
  socket.on('send-message', ({text}) => {

    socket.to(socket.room).emit('receive-message', {
      text,
      username: socket.username,
      timestamp: new Date().toLocaleTimeString(),
    });
  });

  // Typing indicator — broadcast to everyone EXCEPT sender
  socket.on('typing', (isTyping) => {
    if(!socket.room) return;

    socket.to(socket.room).emit('user-typing', {
      username: socket.username,
      isTyping,
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Chat server running → http://localhost:${PORT}`);
});