import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import GameBoard from '../../components/gameBoard';
import Counter from "../../components/counter";
import RestartGame from "../../components/restartGame"
import PlayerWaitModal from './playerWaitModal';
import {
  getSearchParams,
  handleCreateRoom,
  handleJoinRoom,
  handlePlayGame,
  handlePlayerChoice,
  handlePlayerLeaving,
  handleRoundOver,
} from "../../lib"
import ConfettiCel from '../../components/confetti';

let loadingToast;

export default function StartGameSocket() {
  const navigate = useNavigate();
  const searchParam = useSearchParams();
  const { name: playerName, join: joinGame, joinId: gameRoomInput } = getSearchParams(searchParam, ["name", "join", "joinId"]);

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
  const [playerLeft, setPlayerLeft] = useState("");
  const [winningStats, setWinningStats] = useState({
    winner: "",
    winnerName: "",
    winningCombo: [],
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
      const { success, error } = msg;
      if (error) toast.error(error);
      if (success) toast.success(success);
    }
    const handleRoomMessage = (msg) => {
      console.log(msg);
    }

    socket.on(`${socket.id} message`, handleUserMessage)
    socket.on(`${gameRoom} message`, handleRoomMessage)
    socket.on("createRoom", (msg) => handleCreateRoom(msg, loadingToast, setGameRoom))
    socket.on("joinRoom", (msg) => handleJoinRoom(msg, socket.id, loadingToast, playerName, gameRoomInput
      , { setGameBoard, setGameStats, setGameRoom, setRivalStats, setMyStats }))
    socket.on("playGame", (msg) => handlePlayGame(msg, socket, setGameBoard, setGameStats))
    // TODO: handle player leaving the game;
    socket.on("playerLeft", (msg) => handlePlayerLeaving(msg, setPlayerLeft, setGameStats))
    socket.on("roundOver", (msg) => handleRoundOver(msg, setWinningStats, socket, setMyStats, setRivalStats, setGameStats, setGameBoard))

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


  useEffect(() => {
    window.addEventListener("unload", function () {
      socket.emit("leaveGameRoom", [gameRoom]);
      socket.disconnect();
    });
  }, [])


  return (
    <div className='p-4'>
      <div className={`${!gameStats.startGame && "bg-gray-500 opacity-50 w-full h-full fixed top-0 left-0 z-10"}`} />

      {/* wait until player arrive modal */}
      {!joinGame && (
        <PlayerWaitModal gameRoomId={gameRoom} gameStats={gameStats} socket={socket} navigate={navigate} />
      )}

      {playerLeft && (
        <Counter
          message={`Player ${playerLeft} has left the game. Restarting in `}
          start={5}
          setPlayerLeft={setPlayerLeft} />
      )}

      {/* show confetti  */}
      {winningStats.winner && winningStats.winner === socket.id && <ConfettiCel won />}
      {winningStats.winner && winningStats.winner !== socket.id && <ConfettiCel />}

      {winningStats.winner && (<RestartGame socket={socket} winningStats={winningStats} />)}

      <h1 className='font-bold text-4xl sm:text-5xl text-center mb-2'>Tic Tac Toe</h1>
      {/* leave game  */}
      <div className='flex justify-end mb-8'>
        <button className='btn btn-error'
          onClick={() => {
            socket.emit("leaveGameRoom", [gameRoom])
            navigate("/")
          }}>Leave this Game</button>
      </div>

      <GameBoard
        gameStats={gameStats}
        playerMark={myStats.playerMark}
        gameBoard={gameBoard}
        socket={socket}
        gameRoom={gameRoom}
        handlePlayerChoice={handlePlayerChoice}
        winningStats={winningStats} />

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
