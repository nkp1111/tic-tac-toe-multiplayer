import { useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import GameBoard from './gameBoard';
import RestartGame from "../../components/restartGame"
import {
  getSearchParams,
} from "../../lib"
import ConfettiCel from '../../components/confetti';

const PLAYER_MARK = "X";
const COMPUTER_MARK = "O";


export default function StartGameComputer() {
  const navigate = useNavigate();
  const searchParam = useSearchParams();
  const { name: playerName } = getSearchParams(searchParam, ["name"]);

  const [gameStats, setGameStats] = useState({
    startGame: true,
    playerTurn: Math.floor(Math.random() * 2) === 0,
    gameBoard: new Array(9).fill(0).map(() => " "),
  });
  const [stats, setStats] = useState({
    mine: {
      name: playerName || "human",
      won: 0,
      mark: PLAYER_MARK,
    },
    computer: {
      name: "Computer",
      won: 0,
      mark: COMPUTER_MARK,
    },
  });

  const [winningStats, setWinningStats] = useState({
    winner: "",
    winningCombo: [],
  });

  return (
    <div className='p-4 sm:overflow-hidden overflow-auto'>

      {/* show confetti  */}
      {winningStats.winner && winningStats.winner !== "Computer" && <ConfettiCel won />}
      {winningStats.winner && winningStats.winner === "Computer" && <ConfettiCel />}

      {winningStats.winner && (
        <RestartGame winningStats={winningStats} />
      )}

      <h1 className='font-bold text-4xl sm:text-5xl text-center mb-2'>Tic Tac Toe</h1>
      {/* leave game  */}
      <div className='flex justify-end mb-8'>
        <button className='btn btn-error'
          onClick={() => {
            navigate("/")
          }}>Leave this Game</button>
      </div>

      <GameBoard
        gameStats={gameStats}
        setGameStats={setGameStats}
        winningStats={winningStats}
        setWinningStats={setWinningStats}
        stats={stats}
        setStats={setStats}
        gameWithComputer />

      {/* show both players */}
      <div className='flex flex-col gap-4 sm:flex-row my-10 justify-center align-middle'>
        <div className='px-10 flex gap-3 border border-white p-2 rounded-md items-center justify-between shadow-sm shadow-orange-300'>
          <div className="flex gap-10 sm:flex-col sm:gap-3">
            <h2 className={`text-lg font-bold`}>{stats.mine.name}</h2>
            <p className='text-lg font-semibold'>Matches won: {stats.mine.won}</p>
          </div>

          <span className={`bg-info animate-ping h-[10px] w-[10px] rounded-full ${gameStats.startGame && gameStats.playerTurn ? "block" : "hidden"}`} />
        </div>

        <div className='px-10 flex gap-3 border border-white p-2 rounded-md items-center justify-between'>
          <div className="flex gap-10 sm:flex-col sm:gap-3">
            <h2 className='text-lg'>{stats.computer.name}</h2>
            <p className='text-lg'>Matches won: {stats.computer.won}</p>
          </div>

          <span className={`bg-info animate-ping h-[10px] w-[10px] rounded-full ${gameStats.startGame && !gameStats.playerTurn ? "block" : "hidden"}`} />
        </div>
      </div>
    </div>
  )
}
