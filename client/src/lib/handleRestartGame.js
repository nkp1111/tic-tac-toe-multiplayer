import toast from "react-hot-toast";

const handleRestartGame = (msg, socket, setWinningStats, setGameBoard, setGameStats) => {
  console.log(msg);
  const {
    // player1, player1Won, player2, player2Won,gameBoard: sentGameBoard, 
    playerTurn: sentPlayerTurn, success } = msg;
  if (success) toast.success(success);
  setGameBoard(() => (Array.from("         ")));
  setGameStats(() => ({ startGame: true, playerTurn: sentPlayerTurn === socket.id }));
  setWinningStats(() => ({ winner: "", winnerName: "", winningCombo: [] }));
}

export default handleRestartGame;