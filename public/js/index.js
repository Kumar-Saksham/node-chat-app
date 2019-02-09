const socket = io();

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("newMessage", message => {
  console.log("new Message: ", message);
  let li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  $("#messages").append(li);
});

socket.on("newLocationMessage", locationMessage => {
  let li = $("<li></li>");
  let a = $("<a target='_blank' >My Current Location</a>");

  li.text(`${locationMessage.from}: `);
  a.attr('href', locationMessage.url);

  li.append(a);
  $("#messages").append(li);
});

$("#message-form").on("submit", e => {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: $("[name=message]").val()
    },
    fb => {
      console.log(fb);
    }
  );
});

const locationButton = $("#send-location");
locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    err => {
      alert("unable to fetch location.");
    }
  );
});
