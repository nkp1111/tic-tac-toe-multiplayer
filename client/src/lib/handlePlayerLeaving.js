import toast from "react-hot-toast";

export default function handlePlayerLeaving(msg, setPlayerLeft, setGameStats) {
  console.log('player left', msg)
  const { error, success, playerLeft } = msg;
  if (error) toast.error(error);
  if (success) toast.success(success);
  setTimeout(() => {
    setGameStats({ startGame: false, playerTurn: "" });
  }, 5000)
  setPlayerLeft(() => playerLeft);
  return
}
