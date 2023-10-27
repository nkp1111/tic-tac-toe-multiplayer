import toast from "react-hot-toast";
import isPlayerTurn from "./playerTurn";

export default function handleJoinRoom(msg, socketId, loadingToast, playerName, gameRoomInput, setStates) {
  const {
    success, error,
    player1, player1Won,
    player2, player2Won,
    player1Mark, player2Mark,
    playerTurn, gameBoard: sentGameBoard,
  } = msg;

  const { setGameBoard, setGameStats, setGameRoom, setRivalStats, setMyStats } = setStates;
  if (success) {
    if (loadingToast) toast.dismiss(loadingToast);
    toast.success(success);
    let myNewStats = { name: player1, won: player1Won, playerMark: player1Mark }
    let myRivalStats = { name: player2, won: player2Won, playerMark: player2Mark };
    if (player1 !== playerName) {
      const tempStats = myRivalStats;
      myRivalStats = myNewStats;
      myNewStats = tempStats;
    }
    setMyStats(() => (myNewStats));
    setRivalStats(() => (myRivalStats));
    setGameRoom(gameRoomInput);
    setGameBoard(() => sentGameBoard)
    setGameStats(() => ({ startGame: true, playerTurn: isPlayerTurn(playerTurn, socketId) }));

  } else {
    toast.error(error)
  }
}
