const http = require('http');
const httpServer = http.createServer((req, res) => {
    // handle incoming requests here
});

const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin'],
        credentials: true,
    }
});

httpServer.listen(3000, () => {
    console.log('Server listening on port 3000');
});

const users = {}

io.on('connection',socket => {
    
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})