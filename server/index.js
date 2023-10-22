const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const port = process.env.PORT || 3000;
const clientUrls = process.env.CLIENT_URLS || ["http://localhost:5173"];

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

const gameRecords = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  })
});

// io.listen(server);

server.listen(port, () => {
  console.log("Server running on port", port);
})