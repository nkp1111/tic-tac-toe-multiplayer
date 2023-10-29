import toast from "react-hot-toast";

export default function handlePlayerLeaving(msg, setGameStatus, setPlayerLeft) {
  console.log('player left', msg)
  const { error, success, playerLeft } = msg;
  if (error) toast.error(error);
  if (success) toast.success(success);
  setPlayerLeft(() => playerLeft);
  return
}
