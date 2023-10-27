import toast from "react-hot-toast";


const handleCreateRoomMessage = (msg, loadingToast, setGameRoom) => {
  const { success, error, gameRoomId } = msg;
  if (error) return toast.error(error);
  if (loadingToast) toast.dismiss(loadingToast)
  toast.success(success);
  setGameRoom(gameRoomId);
}

export default handleCreateRoomMessage;