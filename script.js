const socket = io();

let username = null;
let currentRoom = null;

document.getElementById('join-chat-button').addEventListener('click', () => {
    const input = document.getElementById('username-input').value;
    if (input.trim()) {
        username = input.trim();
        document.getElementById('nameModal').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
    }
});

function joinRoom(room) {
    if (username) {
        socket.emit('joinRoom', { room, username });
        currentRoom = room;
        document.getElementById('messages').innerHTML = '';
        document.getElementById('room-title').textContent = `Room: ${room}`;
    } else {
        alert('Please enter your name first.');
    }
}

document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('message-input').value;
    if (msg && currentRoom) {
        socket.emit('chatMessage', { room: currentRoom, msg, username });
        document.getElementById('message-input').value = '';
    }
});

socket.on('message', (msg) => {
    const item = document.createElement('div');
    item.classList.add('message');
    item.innerHTML = `<span>${new Date().toLocaleTimeString()}</span> <b>${msg.username}:</b> ${msg.msg}`;
    document.getElementById('messages').appendChild(item);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});
