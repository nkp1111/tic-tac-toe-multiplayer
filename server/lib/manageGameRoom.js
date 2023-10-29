
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

  // adding game room to socket
  socket.gameRoom = gameRoom;
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

  // adding game room info to socket
  socket.gameRoom = gameRoom;

  io.to(gameRoom).emit("joinRoom", message);
}


function leaveGameRoom(io, socket, rooms, args) {
  let message = gameTask[2];
  // if variables are not sent
  if (args.length < 1) {
    message.error = "Player name and game room is not proper";
    socket.emit(`${socket.id} message`, message);
    return;
  }

  const gameRoom = args[0];
  // if game room does not exists
  if (!io.sockets.adapter.rooms.get(gameRoom)) {
    message.error = "Game room does not exist.";
    socket.emit(`${socket.id} message`, message);
    return;
  }

  socket.leave(gameRoom);
  delete rooms[gameRoom][socket.id];
  message.success = "Player has left the game room.";
  message.playerLeft = rooms[gameRoom][socket.id]?.name;

  io.to(gameRoom).emit("playerLeft", message);
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
  if (!rooms[gameRoom]) {
    message.error = "Game room does not exists anymore.";
    socket.emit(`${socket.id} message`, message);
    return;
  }
  const currentPlayer = rooms[gameRoom][socket.id];
  let nextTurn;
  // console.log(rooms[gameRoom], currentPlayer)
  if (!currentPlayer || !currentPlayer.playerTurn) {
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

  // TODO: check winner and manage room accordingly
  const { winner, rival, winningCombo } = checkWinner(rooms[gameRoom])
  if (winner) {
    handleGameWinner(io, socket, rooms, gameRoom, winner, rival, winningCombo);
    return;
  }


  message = {
    ...message,
    gameBoard: rooms[gameRoom].gameBoard,
    playerTurn: nextTurn,
  }
  io.to(gameRoom).emit("playGame", message);
}


function checkWinner(gameRoom) {
  const { gameBoard } = gameRoom;
  const players = Object.keys(gameRoom).filter(p => p !== "gameBoard");
  const player1 = players[0];
  const player2 = players[1];

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Vertical
    [0, 4, 8], [2, 4, 6]             // Diagonal
  ];

  let winner = false;
  let rival = false;
  let winningCombo;
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    // if game board has one of the winning combinations
    // then we have the winner
    if (gameBoard[a] !== " " && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      winner = gameBoard[a] === gameRoom[player1].mark ? player1 : player2;
      rival = winner === player1 ? player2 : player1;
      winningCombo = combo;
    }
  }

  return { winner, rival, winningCombo };
}


function handleGameWinner(io, socket, rooms, gameRoom, winner, rival, winningCombo) {
  const message = gameTask[5]

  rooms[gameRoom][winner].won += 1;
  rooms[gameRoom][winner].playerTurn = false;
  rooms[gameRoom][rival].playerTurn = false;

  message.success = `We have winner for this round`;
  message.winnerWon = rooms[gameRoom][winner].won;
  message.rivalWon = rooms[gameRoom][rival].won;
  message.winningCombo = winningCombo;
  message.winner = winner;
  message.gameBoard = rooms[gameRoom].gameBoard;
  console.log(message);

  io.to(gameRoom).emit("roundOver", message);
}


module.exports = {
  createGameRoom,
  leaveGameRoom,
  joinGameRoom,
  handlePlayerChoice,
}