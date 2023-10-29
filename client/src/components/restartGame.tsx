import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RestartGame(
  { socket, winningStats }
) {
  const navigate = useNavigate();
  const { winner, winnerName } = winningStats;
  const [counter, setCounter] = useState(5);
  useEffect(() => {
    let interval = setInterval(() => {
      setCounter(pre => pre - 1)
    }, 1000)

    if (counter <= 0) {
      socket.emit("restartGame");
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    }
  }, [counter])

  return (
    <div className="p-2 rounded-4">
      <div className="container absolute top-10 sm:w-1/2 sm:left-1/4 left-0 p-4 text-center bg-neutral">
        <h3>This round is over.</h3>
        <h4>Winner is <span className="text-success text-lg">{winnerName}</span></h4>
        <p>Next round will start in {counter} seconds.</p>
      </div>

      {/* leave game room  */}
      <div className='flex justify-end absolute top-16 right-3 sm:hidden'>
        <button type="button" className='btn btn-error rounded-full font-bold text-lg'
          title='Leave this Game'
          aria-label='Leave this game'
          onClick={() => {
            // eslint-disable-next-line react/prop-types
            socket.emit("leaveGameRoom", [socket.gameRoom])
            navigate("/")
          }}>X</button>
      </div>
    </div>
  )
}
