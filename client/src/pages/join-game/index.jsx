import PlayerName from '../../components/playerName'
import { Link, useNavigate } from "react-router-dom"
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';


export default function JoinGame() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("Player");
  const [joinId, setJoinId] = useState("");

  const startPlayingGame = (playerName, joinId, navigate) => {
    navigate(`/start-game-socket?name=${playerName}&join=${true}&joinId=${joinId}`)
  }

  useEffect(() => {
    toast("Select `Player Name` and `Game Room Id`");
  }, [])

  return (
    <div className='flex min-h-screen flex-col items-center p-24'>
      <form onSubmit={(e) => {
        e.preventDefault();
        startPlayingGame(playerName, joinId, navigate);
      }}>
        <label className='mb-5 block'>
          <span className='text-center font-bold'>Player Name: </span>
          {/* player name */}
          <PlayerName {...{ playerName, setPlayerName }} />
        </label>
        <label className='mb-5 block'>
          <span className='text-center font-bold'>Game Room Id: </span>
          {/* game room id  */}
          <PlayerName {...{ playerName: joinId, setPlayerName: setJoinId, join: true }} />
        </label>

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

