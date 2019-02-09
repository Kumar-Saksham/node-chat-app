const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");

    socket.emit('createMessage', {
        from: "Saksham",
        text: "Saksham says back Hi to Admin"
    });

});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("newMessage", message => {
    console.log("new Message: ", message);
})
