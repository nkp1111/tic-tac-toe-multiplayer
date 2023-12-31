import React from 'react'



export default function GameBoard(
  { gameStats, playerMark, gameBoard, handlePlayerChoice, socket, gameRoom, winningStats }
) {
  const { winner, winningCombo } = winningStats;

  return (
    <div className='container m-auto'>
      <div className="flex flex-wrap sm:h-[400px] sm:w-[400px] h-64 w-64 align-middle justify-center m-auto">
        {gameBoard?.map((piece: string, ind: number) => {
          return <div key={ind}
            className={`w-1/3 h-1/3 flex p-4 font-bold text-4xl sm:text-6xl justify-center place-items-center border-4 border-x-2 border-white border-t-0 opacity-90 transition-all ${ind > 5 && "border-b-0"} ${ind % 3 === 0 && "border-l-0"} ${(ind + 1) % 3 === 0 && "border-r-0"} ${gameStats.playerTurn ? "cursor-pointer" : "cursor-not-allowed"}  ${winningCombo.includes(ind) && "text-warning text-6xl sm:text-8xl"}`}
            onClick={(e) => {
              // emit game event for current player and position
              if (!["X", "O"].includes(piece) && gameStats.playerTurn) {
                handlePlayerChoice(socket, gameRoom, ind)
              }
            }}
            onMouseEnter={(e) => {
              if (!["X", "O"].includes(piece) && gameStats.playerTurn) {
                e.currentTarget.textContent = playerMark
              }
            }}
            onMouseLeave={(e) => e.currentTarget.textContent = piece}>
            {piece}
          </div>
        })}
      </div>
    </div>
  )
}
