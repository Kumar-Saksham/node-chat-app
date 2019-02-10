const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("disconnect", () => {
    console.log("User was disconnected");
    const user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage("Admin", `${user.name} has left`))
    }
  });

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Invalid name or room name");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));


    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat room")
    );

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} joined ${params.room}`)
      );
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("Sent");
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
