import React from 'react'


const placeholders = new Array(9).fill(0).map((_, i) => i + 1);

export default function GameBoard() {
  return (
    <div className='container'>
      <div className="flex flex-wrap h-[400px] w-[400px] sm:h-64 sm:w-64 align-middle justify-center m-auto">
        {placeholders.map(piece => {
          return <div key={piece}
            className={`w-1/3 h-1/3 flex p-4 font-bold text-4xl justify-center place-items-center border-4 border-x-2 border-white border-t-0 ${piece > 6 && "border-b-0"} ${piece % 3 === 0 && "border-r-0"} ${(piece - 1) % 3 === 0 && "border-l-0"}`}
            onClick={(e) => {
              console.log(piece + " clicked");
            }}>
            {piece}
          </div>
        })}
      </div>
    </div>
  )
}
