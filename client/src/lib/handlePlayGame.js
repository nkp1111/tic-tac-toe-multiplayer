const handlePlayGame = (msg, setGameBoard, setGameStats) => {
  console.log(msg);
  const { gameBoard: sentGameBoard, playerTurn: sentPlayerTurn } = msg;
  setGameBoard(sentGameBoard);
  setGameStats((pre) => ({ ...pre, playerTurn: sentPlayerTurn }))
}

export default handlePlayGame;