const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });

  socket.on("createMessage", (message, callback) => {
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("Sent");
  });

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcom to the chat room")
  );

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user has joined the chat room")
  );
});

server.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
