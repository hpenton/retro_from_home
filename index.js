const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

let messages = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  io.emit("chat message", messages);

  socket.on("chat message", function(msg) {
    messages.push(msg);
    console.log(messages);
    io.emit("chat message", messages);
  });
  socket.on("reset", () => {
    messages = [];
    io.emit("chat message", messages);
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
