import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import GameBoard from '../../components/gameBoard';
import PlayerWaitModal from './playerWaitModal';

let loadingToast;
const getParamsValue = (searchParam) => {
  const playerName = searchParam && searchParam.length > 0 && searchParam[0].get("name")
    ? searchParam[0].get("name")
    : `Player-#${Math.floor(Math.random() * 100000)}`;
  // if join game already created 
  const joinGame = searchParam && searchParam.length > 0 && searchParam[0].get("join")
    ? searchParam[0].get("join")
    : false;
  const joinGameId = searchParam && searchParam.length > 0 && searchParam[0].get("joinId")
    ? searchParam[0].get("joinId")
    : false;
  return { playerName, joinGame, joinGameId };
}

export default function StartGameSocket() {
  const searchParam = useSearchParams();

  const { playerName, joinGame, joinGameId } = getParamsValue(searchParam);
  console.log(joinGame, joinGameId);

  const [socket, setSocket] = useState(null);
  const [gameRoomId, setGameRoomId] = useState("");
  const [gameStats, setGameStats] = useState({
    startGame: false,
    playerTurn: false,
    opponentName: "",
  });

  // set socket
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    const mySocket = io(serverUrl, { withCredentials: true });
    setSocket(mySocket);
  }, []);

  // connect to socket
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log('connected to server');
      toast.success("Successfully connected to server socket");
    })

    return () => {
      socket.off("connect")
    }
  }, [socket]);


  // listen for messages 
  useEffect(() => {
    if (!socket) return;
    const handleUserMessage = (msg) => {
      console.log(msg);
    }
    const handleRoomMessage = (msg) => {
      console.log(msg);
    }

    socket.on(`${socket.id} message`, handleUserMessage)
    socket.on(`${gameRoomId} message`, handleRoomMessage)

    return () => {
      socket.off(`${socket.id} message`, handleUserMessage)
      socket.off(`${gameRoomId} message`, handleRoomMessage)
    }
  }, [gameRoomId, socket]);


  // join game room or create new game room
  useEffect(() => {
    if (!socket) return;
    if (joinGame && joinGameId) {
      loadingToast = toast.loading("Joining game room...");
      socket.emit("joinGameRoom", joinGameId);
    }
    else if (!gameRoomId) {
      loadingToast = toast.loading("Creating game room...")
      socket.emit("createGameRoom")
    }
  }, [gameRoomId, joinGame, joinGameId, socket]);


  return (
    <div className='p-4'>
      <div className={`${!gameStats.startGame && "bg-gray-500 opacity-50 w-full h-full fixed top-0 left-0 z-10"}`} />

      {/* wait until player arrive modal */}
      {!joinGame && (
        <PlayerWaitModal gameRoomId={gameRoomId} gameStats={gameStats} />
      )}

      <h1 className='font-bold text-6xl sm:text-4xl text-center'>Tic Tac Toe</h1>
      <GameBoard />

      {/* show both players */}
      <div className='flex flex-col sm:flex-row my-10 justify-center align-middle'>
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
