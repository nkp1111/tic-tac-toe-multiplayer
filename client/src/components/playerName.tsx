import React from "react";

export default function PlayerName(
  { playerName, setPlayerName, join }
) {
  return (
    <div className={`${!join ? 'border-b-white border-b-4' : "shadow-md mt-2"}`}>
      <input type="text"
        placeholder={`${!join ? "Player1" : "Game room Id"}`}
        name={`${!join ? "playerName" : "joinId"}`}
        value={playerName}
        onChange={(e) => setPlayerName(() => e.target.value)}
        className={`bg-transparent border-0 focus:border-0 outline-0 text-center p-2 shadow-md font-mono w-full ${!join ? "text-4xl" : "text-2xl"}`}
        autoFocus
      />
    </div>
  )
}
