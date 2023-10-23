import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function StartGameSocket() {
  const searchParam = useSearchParams();
  const playerName = searchParam && searchParam.length > 0 && searchParam[0].get("name")
    ? searchParam[0].get("name")
    : `Player-#${Math.floor(Math.random() * 100000)}`;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    const mySocket = io(serverUrl, { withCredentials: true });
    setSocket(mySocket);
    mySocket.on("connect", () => {
      console.log('connected to server');
    })
  }, []);


  useEffect(() => {
    if (!socket) return;
    socket.emit("createGameRoom")
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on(`${socket.id} message`, (response) => {
      console.log(response);
    })
  }, [socket]);
  return (
    <div>
      Start Game With Socket  {playerName}
    </div>
  )
}
