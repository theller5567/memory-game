import React from 'react'

function WinLose({ isGameWon, isGameLost }) {
  return (
    <div className="win-lose-container">
       {isGameWon && <div className="win bg-green-500">
          <h2>Congratulations!<br />You won!</h2>
        </div>
        }
      {isGameLost && (
        <div className="lose bg-red-500">
          <h2>Game Over!<br />You lost!</h2>
        </div>
      )}
    </div>
  )
}

export default WinLose