const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New WS Connection...');

    socket.on('joinRoom', ({ room, username }) => {
        socket.join(room);
        socket.room = room;  // Store the room the socket is in
        socket.username = username;  // Store the username
        io.to(room).emit('message', { username: 'System', msg: `${username} has joined the room` });
    });

    socket.on('chatMessage', ({ room, msg, username }) => {
        io.to(room).emit('message', { username, msg }); // Send to the specific room
        socket.broadcast.emit('message', { username, msg }); // Send to all connected users
    });

    socket.on('disconnect', () => {
        if (socket.room && socket.username) {
            io.to(socket.room).emit('message', { username: 'System', msg: `${socket.username} has left the room` });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
