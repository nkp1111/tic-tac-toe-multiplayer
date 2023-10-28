
const { v4 } = require("uuid");
const { gameTask } = require("./gameTask");

/**
 * @desc Creates a new game room for 2 players 
 * @param {object} rooms - game room in which two user are connected 
 * @param {*} socketId - socket id of the user create game room
 * @returns 
 */
function createGameRoom(io, socket, rooms, args) {
  const gameRoom = v4();
  const playerName = args[0];
  socket.join(gameRoom)
  rooms[gameRoom] = {
    [socket.id]: { name: playerName, playerTurn: false, won: 0, mark: "X" },
  }
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
    [socket.id]: { name: playerName, playerTurn: turn, won: 0, mark: "O" },
    gameBoard: Array.from("         "),
  };

  // manage turn
  rooms[gameRoom][player1Socket].playerTurn = !turn;
  message.player1Mark = "X";
  message.player2Mark = "O";
  message.player1 = rooms[gameRoom][player1Socket].name;
  message.player1Won = rooms[gameRoom][player1Socket].won;
  if (!turn) {
    message.playerTurn = player1Socket;
  } else {
    message.playerTurn = socket.id;
  }

  message.player2 = playerName;
  message.player2Won = 0;
  message.gameBoard = rooms[gameRoom].gameBoard;

  io.to(gameRoom).emit("joinRoom", message);
}


function leaveGameRoom(rooms, gameRoomId, socketId) {

}


function leftGameRoom(rooms, socketId) {

}


function handlePlayerChoice(io, socket, rooms, args) {
  let message = gameTask[4];
  if (args.length < 2) {
    message.error = "Game room and player choice is required";
    socket.emit(`${socket.id} message`, message);
    return;
  }
  // console.log(args)
  const gameRoom = args[0];
  const playerChoice = args[1]; // 0 - 8
  const currentPlayer = rooms[gameRoom][socket.id];
  let nextTurn;
  // console.log(rooms[gameRoom], currentPlayer)
  if (!currentPlayer.playerTurn) {
    message.error = "It is not your turn yet!";
    socket.emit(`${socket.id} message`, message);
    return;
  }

  rooms[gameRoom].gameBoard[+playerChoice] = currentPlayer.mark;
  // console.log(rooms[gameRoom], "before")
  Object.keys(rooms[gameRoom]).forEach(player => {
    if (player !== "gameBoard") {
      rooms[gameRoom][player].playerTurn = !rooms[gameRoom][player].playerTurn;
    }
    if (!["gameBoard", socket.id].includes(player)) {
      nextTurn = player;
    }
  })

  message = {
    ...message,
    gameBoard: rooms[gameRoom].gameBoard,
    playerTurn: nextTurn,
  }
  io.to(gameRoom).emit("playGame", message);
}


module.exports = {
  createGameRoom,
  leaveGameRoom,
  leftGameRoom,
  joinGameRoom,
  handlePlayerChoice,
}