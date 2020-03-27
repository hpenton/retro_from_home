const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const hash = require("object-hash");

let messages = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  io.emit("chat message", messages);

  socket.on("chat message", function(msg) {
    const messageKey = hash(msg);
    let newMessage = { name: messageKey, message: msg, dots: 0 };

    messages.push(newMessage);

    io.emit("chat message", messages);
  });
  socket.on("reset", () => {
    messages = [];
    io.emit("chat message", messages);
  });
  socket.on("dot", dotKey => {
    messages.find(el => el.name === dotKey).dots++;
    io.emit("chat message", messages);
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
