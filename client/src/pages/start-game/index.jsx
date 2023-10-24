import PlayerName from '../../components/playerName'
import SelectGameMode from '../../components/selectGameMode'
import { Link, useNavigate } from "react-router-dom"
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';


export default function StartGame() {
  const [playerName, setPlayerName] = useState("Player");
  const [gameMode, setGameMode] = useState("human");
  const navigate = useNavigate();
  const startPlayingGame = (playerName, gameMode, navigate) => {
    if (gameMode === "human") {
      navigate(`/start-game-socket?name=${playerName}`)
    }
    if (gameMode === "computer") {
      navigate(`/start-game-computer?name=${playerName}`)
    }
  }

  useEffect(() => {
    toast("Select `Player Name` and `Game Mode`");
  }, [])

  return (
    <div className='flex min-h-screen flex-col items-center p-24'>
      <form onSubmit={(e) => {
        e.preventDefault();
        startPlayingGame(playerName, gameMode, navigate);
      }}>
        {/* player name */}
        <PlayerName {...{ playerName, setPlayerName }} />
        {/* game mode  */}
        <SelectGameMode {...{ gameMode, setGameMode }} />

        <div className='flex mt-16 gap-4 justify-center align-middle border-b-sky-200 text-white'>

          <Link to="/" className='btn btn-neutral px-5 shadow-sm shadow-green-400'>
            <FaLongArrowAltLeft className="text-xl" />
            Back
          </Link>

          <button type="submit"
            className='btn btn-neutral px-5 shadow-sm shadow-red-400'>
            Let&apos;s Go
            <FaLongArrowAltRight className="text-xl" />
          </button>
        </div>
      </form>
    </div>
  )
}
