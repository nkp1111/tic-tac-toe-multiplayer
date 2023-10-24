import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function StartGameSocket() {
  const searchParam = useSearchParams();
  const playerName = searchParam && searchParam.length > 0 && searchParam[0].get("name")
    ? searchParam[0].get("name")
    : `Player-#${Math.floor(Math.random() * 100000)}`;
  const [socket, setSocket] = useState(null);
  const [gameRoomId, setGameRoomId] = useState("");

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    const mySocket = io(serverUrl, { withCredentials: true });
    setSocket(mySocket);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log('connected to server');

      // create new game room 
      if (!gameRoomId) {
        socket.emit("createGameRoom")
      }

      // listen user message
      socket.on(`${socket.id} message`, (response) => {
        // create game room message
        // console.log(response)
        if (response.id === 1) {
          setGameRoomId(response.roomId)
        }
      })

      // listen game room message
      socket.on(`${gameRoomId} message`, (response) => {
        console.log(response);
        console.log("game room message")
        if (response.id === 3) {
          console.log(response.success);
        }
      })

    })
  }, [gameRoomId, socket])


  return (
    <div>
      Start Game With Socket  {playerName}
    </div>
  )
}
