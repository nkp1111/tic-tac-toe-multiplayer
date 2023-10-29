import toast from "react-hot-toast";


export default function handleRoundOver(msg, setWinningStats, socket, setMyStats, setRivalStats, setGameStats, setGameBoard) {

  const { winner, winningCombo, winnerWon, rivalWon, success, gameBoard, winnerName } = msg;

  if (!success) return;
  console.log(msg)

  toast.success(success)

  setWinningStats({
    winner,
    winnerName,
    winningCombo,
  })

  setGameStats((pre) => ({ ...pre, playerTurn: false }));
  setGameBoard(gameBoard);

  if (winner === socket.id) {
    setMyStats((pre) => ({ ...pre, won: winnerWon }))
  } else {
    setRivalStats((pre) => ({ ...pre, won: winnerWon }));
  }

  return
}
