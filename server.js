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
    socket.playerData = playerData;

    if (waitingPlayer && waitingPlayer !== socket) {
      // Match players
      socket.opponent = waitingPlayer;
      waitingPlayer.opponent = socket;

      socket.emit("matched", waitingPlayer.playerData);
      waitingPlayer.emit("matched", socket.playerData);

      waitingPlayer = null;
    } else {
      waitingPlayer = socket;
      socket.emit("waiting");
    }
  });

  socket.on("fight", () => {
    if (!socket.opponent) return;

    const winner =
      Math.random() > 0.5 ? socket.id : socket.opponent.id;

    socket.emit("fightResult", winner === socket.id);
    socket.opponent.emit(
      "fightResult",
      winner === socket.opponent.id
    );
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    // If waiting player disconnects
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }

    // If matched player disconnects
    if (socket.opponent) {
      socket.opponent.emit("opponentLeft");
      socket.opponent.opponent = null;
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


