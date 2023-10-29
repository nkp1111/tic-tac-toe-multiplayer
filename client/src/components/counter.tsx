import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";

// TODO: counter not working as intended
export default function Counter({
  start = 5,
  message = "",
  setPlayerLeft }) {
  const [counter, setCounter] = useState(start);

  useEffect(() => {
    const loadingToast = toast.loading("Player left the game. Please restart anew...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
    }, 5000)
  }, [])

  useEffect(() => {
    let interval = setInterval(() => {
      setCounter(pre => pre - 1)
    }, 1000)

    if (counter <= 0) {
      setPlayerLeft("")
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval)
    }
  }, [counter])


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
