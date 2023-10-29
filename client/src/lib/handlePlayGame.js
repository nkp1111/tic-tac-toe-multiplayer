const handlePlayGame = (msg, socket, setGameBoard, setGameStats) => {
  console.log(msg);
  const { gameBoard: sentGameBoard, playerTurn: sentPlayerTurn } = msg;
  setGameBoard(sentGameBoard);
  setGameStats((pre) => ({ ...pre, playerTurn: sentPlayerTurn === socket.id }))
}

export default handlePlayGame;