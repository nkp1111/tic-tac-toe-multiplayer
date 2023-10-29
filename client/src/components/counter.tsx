import React, { useEffect, useState } from 'react'


// TODO: counter not working as intended
export default function Counter({
  start = 5,
  message = "",
  setPlayerLeft }) {
  const [counter, setCounter] = useState(start);

  useEffect(() => {
    let interval = setInterval(() => {
      if (counter) {
        setCounter(pre => pre - 1);
      } else {
        setPlayerLeft("");
        clearInterval(interval);
      }
    }, 1000);

  }, [counter]);


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
