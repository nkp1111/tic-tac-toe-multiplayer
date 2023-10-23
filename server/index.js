const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { createGameRoom } = require("./lib/manageGameRoom");
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
  }
});

const gameRecords = {
  userCount: 0,
  rooms: {}
};

io.on("connection", (socket) => {
  console.log("A user connected");
  gameRecords.userCount += 1;

  // create game room
  socket.on("createGameRoom", (response) => {
    console.log('new game room created');
    let { rooms, message } = createGameRoom(gameRecords.rooms, socket.id)
    gameRecords.rooms = rooms;
    socket.emit(`${socket.id} message`, message);
  })

  // socket.on("joinGameRoom", (id) => {
  //   if (Object.keys(gameRecords.rooms).includes(id)
  //     && gameRecords.rooms[id].length > 2) {
  //     gameRecords.rooms[id].push(socket.id);
  //     socket.emit(`${socket.id} message`, { message: "You have joined the game room" })
  //   }
  // })

  socket.on("leaveGameRoom", (args, callback) => {
    const gameRoomId = args;
    console.log(gameRoomId)

  })

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // leave game room
    // destroy game room 
    gameRecords.userCount -= 1;
  })
});

// io.listen(server);

server.listen(port, () => {
  console.log("Server running on port", port);
})