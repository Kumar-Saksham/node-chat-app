const socket = io();

const scrollToBottom = () => {
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", () => {
  console.log("Connected to server");
  const params = $.deparam(window.location.serch);
  socket.emit('join', params, err => {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on('updateUserList', users => {
  const ol = $('<ol></ol>');

  users.forEach(user => ol.append($('<li></li>').text(user)));
  $('#users').html(ol);
});

socket.on("newMessage", message => {
  const formattedTime = moment(message.createdAt).format("hh:mm A");
  const template = $("#message-template").html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $("#messages").append(html);
  scrollToBottom();
});

socket.on("newLocationMessage", locationMessage => {
  const formattedTime = moment(locationMessage.createdAt).format("hh:mm A");
  const template = $("#location-message-template").html();
  const html = Mustache.render(template, {
    url: locationMessage.url,
    from: locationMessage.from,
    createdAt: formattedTime
  });
  $("#messages").append(html);
  scrollToBottom();
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

  locationButton.attr("disabled", "disabled").text("Sending Location...");

  navigator.geolocation.getCurrentPosition(
    position => {
      locationButton.removeAttr("disabled").text("Send Location");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    err => {
      locationButton.removeAttr("disabled").text("Send Location");
      alert("unable to fetch location.");
    }
  );
});
