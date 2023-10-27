const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { createGameRoom, leaveGameRoom, leftGameRoom, joinGameRoom, handlePlayerChoice } = require("./lib/manageGameRoom");
const { gameTask } = require("./lib/gameTask");
require("dotenv").config();

const port = process.env.PORT || 3000;
let clientUrls = process.env.CLIENT_URLS;
if (clientUrls) {
  clientUrls = clientUrls.includes(",")
    ? clientUrls.split(",")
    : [clientUrls];
} else {
  clientUrls = ["http://localhost:5173"];
}


const app = express();
// app.use(
//   cors({
//     origin: clientUrls,
//     credentials: true,
//     allowedHeaders: 'Content-Type, Authorization, Access-Control-Allow-Origin',
//   })
// );

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: clientUrls,
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Access-Control-Allow-Origin',
  },
  connectionStateRecovery: {},
});

let userCount = 0;
let rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");
  userCount += 1;
  console.log(userCount);

  socket.on("createGameRoom", (args) => createGameRoom(io, socket, rooms, args))
  socket.on("joinGameRoom", (args) => joinGameRoom(io, socket, rooms, args))
  socket.on("leaveGameRoom", () => leaveGameRoom(io, socket))
  socket.on("playerChoice", (args) => handlePlayerChoice(io, socket, rooms, args))

  socket.on("disconnect", () => {
    console.log("User disconnected");
    userCount -= 1;
  })
});

// io.listen(server);

server.listen(port, () => {
  console.log("Server running on port", port);
})