import React, { useEffect, useState } from 'react'


// TODO: counter not working as intended
export default function Counter({
  start = 5,
  message = "",
  setGameStats,
  setPlayerLeft }) {
  const [counter, setCounter] = useState(start);
  const handleGameStats = () => {
    setGameStats({ startGame: false, playerTurn: "" });
    setPlayerLeft("")
  }

  useEffect(() => {
    let interval = setInterval(() => {
      if (counter) {
        setCounter(pre => pre - 1);
      } else {
        handleGameStats();
        clearInterval(interval);
      }
    }, 1000);

  }, [counter, handleGameStats]);


  return (
    <div className="toast toast-top toast-center">
      <div className="alert alert-warning">
        <span>{message}</span>
        <span className="countdown">
          <span>{counter}</span>
        </span>
      </div>
    </div>
  )
}
