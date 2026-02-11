const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let waitingPlayer = null;

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("findOpponent", (playerData) => {
    if (waitingPlayer) {
      socket.opponent = waitingPlayer;
      waitingPlayer.opponent = socket;

      socket.emit("matched", waitingPlayer.playerData);
      waitingPlayer.emit("matched", playerData);

      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.playerData = playerData;
    }
  });

  socket.on("fight", () => {
    if (socket.opponent) {
      const winner =
        Math.random() > 0.5 ? socket.id : socket.opponent.id;

      io.to(socket.id).emit("fightResult", winner === socket.id);
      io.to(socket.opponent.id).emit(
        "fightResult",
        winner === socket.opponent.id
      );
    }
  });

  socket.on("disconnect", () => {
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
