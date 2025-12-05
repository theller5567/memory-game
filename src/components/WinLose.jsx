import React from 'react'

function WinLose({ isGameWon, isGameLost, tryAgain }) {
  return (
    <div className={`win-lose-container ${isGameWon ? "bg-green-500" : "bg-red-500"}`}>
       {isGameWon && <div className="win">
          <h2>Congratulations!<br />You won!</h2>
          <button onClick={tryAgain} className="btn btn--try-again">Try Again</button>
        </div>
        }
      {isGameLost && (
        <div className="lose">
          <h2>Game Over!<br />You lost!<br />You exceeded the flip limit.</h2>
          <button onClick={tryAgain} className="btn btn--try-again">Try Again</button>
        </div>
      )}
    </div>
  )
}

export default WinLose