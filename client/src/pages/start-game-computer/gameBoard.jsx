import { useEffect } from 'react'
import { PropTypes } from "prop-types"

const restartGame = (setGameStats, setWinningStats) => {
  setTimeout(() => {
    setGameStats((pre) => ({
      ...pre,
      startGame: true,
      gameBoard: new Array(9).fill(0).map(() => " "),
    }))

    setWinningStats(() => ({ winner: "", winningCombo: [] }))
  }, 5000)
}

const checkWinner = (gameBoard, stats, setGameStats, setWinningStats, setStats) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Vertical
    [0, 4, 8], [2, 4, 6]             // Diagonal
  ];

  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    // if game board has one of the winning combinations
    // then we have the winner
    let winner;
    if (gameBoard[a] !== " " && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      winner = gameBoard[a] === stats.mine.mark ? stats.mine.name : "Computer";
      setGameStats((pre) => ({ ...pre, startGame: false, playerTurn: false }));
      setWinningStats((pre) => ({ ...pre, winningCombo: combo, winner }))
      if (winner === "Computer") {
        setStats((pre) => ({ ...pre, computer: { ...stats.computer, won: stats.computer.won + 1 } }))
      } else {
        setStats((pre) => ({ ...pre, mine: { ...stats.mine, won: stats.mine.won + 1 } }))
      }
      restartGame(setGameStats, setWinningStats);
    }
  }
}


export default function GameBoard(
  { gameStats: { gameBoard, playerTurn, startGame },
    setGameStats,
    winningStats: { winningCombo },
    setWinningStats,
    setStats,
    stats }
) {

  const choicesAvailable = (gameBoard) => gameBoard.map((piece, ind) => {
    if (piece === " ") return ind;
    else return null;
  }).filter(piece => piece !== null);


  useEffect(() => {
    if (!startGame) return;
    if (playerTurn) return;

    setTimeout(() => {
      const availablePos = choicesAvailable(gameBoard);
      const choice = availablePos[Math.floor(Math.random() * availablePos.length)];
      let newGameBoard = gameBoard;
      newGameBoard[choice] = "O";
      setGameStats((pre) => ({ ...pre, gameBoard: newGameBoard, playerTurn: true }));
      checkWinner(gameBoard, stats, setGameStats, setWinningStats, setStats)
    }, 1000)

  }, [gameBoard, playerTurn, setGameStats, setStats, setWinningStats, startGame, stats])

  return (
    <div className='container m-auto'>
      <div className="flex flex-wrap sm:h-[400px] sm:w-[400px] h-64 w-64 align-middle justify-center m-auto">
        {gameBoard?.map((piece, ind) => {
          return <div key={ind}
            className={`w-1/3 h-1/3 flex p-4 font-bold text-4xl sm:text-6xl justify-center place-items-center border-4 border-x-2 border-white border-t-0 opacity-90 transition-all 
            ${ind > 5 && "border-b-0"} 
            ${ind % 3 === 0 && "border-l-0"} 
            ${(ind + 1) % 3 === 0 && "border-r-0"} 
            ${playerTurn ? "cursor-pointer" : "cursor-not-allowed"}  
            ${winningCombo.includes(ind) && "text-warning text-6xl sm:text-8xl"}`}
            onClick={() => {
              // emit game event for current player and position
              if (!["X", "O"].includes(piece) && playerTurn) {
                let newGameBoard = gameBoard;
                newGameBoard[ind] = "X";
                setGameStats((pre) => ({ ...pre, gameBoard: newGameBoard, playerTurn: false }));
                checkWinner(gameBoard, stats, setGameStats, setWinningStats, setStats)
              }
            }}
            onMouseEnter={(e) => {
              if (!["X", "O"].includes(piece) && playerTurn) {
                e.currentTarget.textContent = "X"
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


GameBoard.propTypes = {
  gameStats: PropTypes.object.isRequired,
  setGameStats: PropTypes.any,
  winningStats: PropTypes.object.isRequired,
  setWinningStats: PropTypes.any,
  setStats: PropTypes.any,
  stats: PropTypes.object.isRequired,
}