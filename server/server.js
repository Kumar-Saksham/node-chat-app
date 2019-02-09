const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Admin says Hi!',
        createdAt: new Date().getTime()
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    socket.on('createMessage', message => {
        console.log("Create Message: ", message);
    })
});




server.listen(port, () => {
    console.log(`listening on port ${port}...`);
})