import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import GameBoard from '../../components/gameBoard';
import PlayerWaitModal from './playerWaitModal';
import {
  handleCreateRoom,
  handleJoinRoom,
  handlePlayGame,
  handlePlayerChoice,
} from "../../lib"

let loadingToast;
const getParamsValue = (searchParam) => {
  const playerName = searchParam && searchParam.length > 0 && searchParam[0].get("name")
    ? searchParam[0].get("name")
    : `Player-#${Math.floor(Math.random() * 100000)}`;
  // if join game already created 
  const joinGame = searchParam && searchParam.length > 0 && searchParam[0].get("join")
    ? searchParam[0].get("join")
    : false;
  const gameRoom = searchParam && searchParam.length > 0 && searchParam[0].get("joinId")
    ? searchParam[0].get("joinId")
    : false;
  return { playerName, joinGame, gameRoom };
}

export default function StartGameSocket() {
  const searchParam = useSearchParams();

  const { playerName, joinGame, gameRoom: gameRoomInput } = getParamsValue(searchParam);
  console.log(joinGame, gameRoomInput);

  const [socket, setSocket] = useState(null);
  const [gameRoom, setGameRoom] = useState("");
  const [gameStats, setGameStats] = useState({
    startGame: false,
    playerTurn: false,
  });
  const [myStats, setMyStats] = useState({
    name: "",
    won: 0,
  });
  const [rivalStats, setRivalStats] = useState({
    name: "",
    won: 0,
  });
  const [gameBoard, setGameBoard] = useState(new Array(9).fill(0).map(() => " "));

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
    socket.on(`${gameRoom} message`, handleRoomMessage)
    socket.on("createRoom", (msg) => handleCreateRoom(msg, loadingToast, setGameRoom))
    socket.on("joinRoom", (msg) => handleJoinRoom(msg, socket.id, loadingToast, playerName, gameRoomInput
      , { setGameBoard, setGameStats, setGameRoom, setRivalStats, setMyStats }))
    socket.on("playGame", (msg) => handlePlayGame(msg, setGameBoard, setGameStats))

    // return () => {
    //   socket.off(`${socket.id} message`, handleUserMessage)
    //   socket.off(`${gameRoom} message`, handleRoomMessage)
    //   socket.off("createRoom", handleCreateRoomMessage)
    // }
  }, [gameRoom, gameRoomInput, playerName, socket]);


  // join game room or create new game room
  useEffect(() => {
    if (!socket) return;
    if (joinGame && gameRoomInput) {
      loadingToast = toast.loading("Joining game room...");
      socket.emit("joinGameRoom", [playerName, gameRoomInput]);
    }
    else if (!gameRoom) {
      loadingToast = toast.loading("Creating game room...")
      socket.emit("createGameRoom", [playerName])
    }
  }, [gameRoom, gameRoomInput, joinGame, playerName, socket]);


  return (
    <div className='p-4'>
      <div className={`${!gameStats.startGame && "bg-gray-500 opacity-50 w-full h-full fixed top-0 left-0 z-10"}`} />

      {/* wait until player arrive modal */}
      {!joinGame && (
        <PlayerWaitModal gameRoomId={gameRoom} gameStats={gameStats} />
      )}

      <h1 className='font-bold text-4xl sm:text-6xl text-center mb-10'>Tic Tac Toe</h1>
      <GameBoard
        gameStats={gameStats}
        playerMark={myStats.playerMark}
        gameBoard={gameBoard}
        socket={socket}
        gameRoom={gameRoom}
        handlePlayerChoice={handlePlayerChoice} />

      {/* show both players */}
      <div className='flex flex-col gap-4 sm:flex-row my-10 justify-center align-middle'>
        <div className='px-10 flex gap-3 border border-white p-2 rounded-md items-center justify-between shadow-sm shadow-orange-300'>
          <div className="flex gap-10 sm:flex-col sm:gap-3">
            <h2 className={`text-lg font-bold`}>{myStats.name}</h2>
            <p className='text-lg font-semibold'>Matches won: {myStats.won}</p>
          </div>

          <span className={`bg-info animate-ping h-[10px] w-[10px] rounded-full ${gameStats.startGame && gameStats.playerTurn ? "block" : "hidden"}`} />
        </div>

        <div className='px-10 flex gap-3 border border-white p-2 rounded-md items-center justify-between'>
          <div className="flex gap-10 sm:flex-col sm:gap-3">
            <h2 className='text-lg'>{rivalStats.name}</h2>
            <p className='text-lg'>Matches won: {rivalStats.won}</p>
          </div>

          <span className={`bg-info animate-ping h-[10px] w-[10px] rounded-full ${gameStats.startGame && !gameStats.playerTurn ? "block" : "hidden"}`} />
        </div>
      </div>
    </div>
  )
}
