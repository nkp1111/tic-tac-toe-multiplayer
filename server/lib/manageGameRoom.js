
const { v4 } = require("uuid");
const { gameTask } = require("./gameTask");

/**
 * @desc Creates a new game room for 2 players 
 * @param {object} rooms - game room in which two user are connected 
 * @param {*} socketId - socket id of the user create game room
 * @returns 
 */
function createGameRoom(io, socket, rooms, args) {
  const gameRoom = "1" || v4();
  const playerName = args[0];
  socket.join(gameRoom)
  rooms[gameRoom] = { [socket.id]: { name: playerName, playerTurn: false, won: 0 } }
  const message = gameTask[0];
  message.success = "Game room created successfully.";
  message.gameRoomId = gameRoom;
  io.to(gameRoom).emit("createRoom", message);
}


function joinGameRoom(io, socket, rooms, args) {
  let message = gameTask[1];
  // if variables are not sent
  if (args.length < 2) {
    message.error = "Player name and game room is not proper";
    socket.emit(`${socket.id} message`, message);
    return;
  }

  const playerName = args[0];
  const gameRoom = args[1];
  // if game room does not exists
  if (!io.sockets.adapter.rooms.get(gameRoom)) {
    message.error = "Game room does not exist.";
    socket.emit(`${socket.id} message`, message);
    return;
  }
  // join game room
  socket.join(gameRoom)
  message.success = "Player joined the game";
  const turn = Math.floor(Math.random() * 2) === 0;

  const player1Socket = Object.keys(rooms[gameRoom])[0];

  // update room 
  rooms[gameRoom] = {
    ...rooms[gameRoom],
    [socket.id]: { name: playerName, playerTurn: turn, won: 0 }
  };

  // manage turn
  rooms[gameRoom][player1Socket].playerTurn = !turn;
  message.player1 = rooms[gameRoom][player1Socket].name;
  message.player1Won = rooms[gameRoom][player1Socket].won;
  if (!turn) {
    message.playerTurn = player1Socket;
  } else {
    message.playerTurn = socket.id;
  }

  message.player2 = playerName;
  message.player2Won = 0;

  io.to(gameRoom).emit("joinRoom", message);
}


function leaveGameRoom(rooms, gameRoomId, socketId) {

}


function leftGameRoom(rooms, socketId) {

}


module.exports = {
  createGameRoom,
  leaveGameRoom,
  leftGameRoom,
  joinGameRoom,
}