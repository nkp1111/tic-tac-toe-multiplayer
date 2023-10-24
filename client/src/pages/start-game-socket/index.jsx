import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import GameBoard from '../../components/gameBoard';
import PlayerWaitModal from './playerWaitModal';

let loadingToast;

export default function StartGameSocket() {
  const searchParam = useSearchParams();
  const playerName = searchParam && searchParam.length > 0 && searchParam[0].get("name")
    ? searchParam[0].get("name")
    : `Player-#${Math.floor(Math.random() * 100000)}`;
  const [socket, setSocket] = useState(null);
  const [gameRoomId, setGameRoomId] = useState("");
  const [gameStats, setGameStats] = useState({
    startGame: false,
    playerTurn: false,
    opponentName: "",
  });

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    const mySocket = io(serverUrl, { withCredentials: true });
    setSocket(mySocket);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log('connected to server');
      toast.success("Successfully connected to server socket");

      // create new game room 
      if (!gameRoomId) {
        loadingToast = toast.loading("Creating game room...")
        socket.emit("createGameRoom")
      }

      // listen user message
      socket.on(`${socket.id} message`, (response) => {
        // create game room message
        // console.log(response)
        if (response.id === 1) {
          toast.dismiss(loadingToast);
          toast.success("Game room created.")
          setGameRoomId(response.roomId)
        }
      })

      // listen game room message
      socket.on(`${gameRoomId} message`, (response) => {
        console.log(response);
        console.log("game room message")
        // game leaving message
        if (response.id === 3) {
          console.log(response.success);
        }
      })
    })
  }, [gameRoomId, socket])


  return (
    <div className='p-4'>
      <div className={`${!gameStats.startGame && "bg-gray-500 opacity-50 w-full h-full fixed top-0 left-0 z-10"}`} />

      {/* wait until player arrive modal */}
      <PlayerWaitModal gameRoomId={gameRoomId} gameStats={gameStats} />

      <h1 className='font-bold text-6xl sm:text-4xl text-center'>Tic Tac Toe</h1>
      <GameBoard />

      {/* show both players */}
      <div className='flex flex-row sm:flex-col my-10 justify-center align-middle'>
        <div className='border-r-2 border-white px-10 flex gap-3'>
          <h2 className='text-lg font-semibold'>{playerName}</h2>
          <span className={`badge badge-info ${gameStats.startGame && gameStats.playerTurn ? "block" : "hidden"}`} />
        </div>

        <div className='border-l-2 border-white px-10 flex gap-3'>
          <h2 className='text-lg font-semibold'>{gameStats.opponentName}</h2>
          <span className={`badge badge-info ${gameStats.startGame && !gameStats.playerTurn ? "block" : "hidden"}`} />
        </div>
      </div>
    </div>
  )
}
