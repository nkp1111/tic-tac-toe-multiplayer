const handlePlayerChoice = (socket, gameRoom, choice) => {
  if (!socket) return;
  socket.emit("playerChoice", [gameRoom, choice]);
}

export default handlePlayerChoice;