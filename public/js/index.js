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
  a.attr("href", locationMessage.url);

  li.append(a);
  $("#messages").append(li);
});

$("#message-form").on("submit", e => {
  e.preventDefault();
  const messageTextbox = $("[name=message]");
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextbox.val()
    },
    fb => {
      messageTextbox.val("");
      console.log(fb);
    }
  );
});

const locationButton = $("#send-location");
locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  locationButton.attr("disabled", "disabled").text('Sending Location...');

  navigator.geolocation.getCurrentPosition( position => {
      locationButton.removeAttr('disabled').text('Send Location');
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    err => {
        locationButton.removeAttr('disabled').text('Send Location');
      alert("unable to fetch location.");
    }
  );
});
