import { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function StartGameSocket() {
  const searchParam = useSearchParams();
  const playerName = searchParam && searchParam.length > 0 && searchParam[0].get("name")
    ? searchParam[0].get("name")
    : `Player-#${Math.floor(Math.random() * 100000)}`;

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
    const mySocket = io(serverUrl, { withCredentials: true });
    mySocket.on("connect", () => {
      console.log(mySocket.id)
      console.log('connected to server');
    })
  }, []);

  return (
    <div>
      Start Game With Socket  {playerName}
    </div>
  )
}
