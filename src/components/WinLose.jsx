import React from 'react'

function WinLose({ isGameWon, isGameLost, tryAgain, exitGame }) {

    const winLose = isGameWon ? "win" : "lose";
    const winLoseText = isGameWon ? <h2>Congratulations!<br />You won!</h2> : <h2>Game Over!<br />You lost!<br />You exceeded the flip limit.</h2>;
  return (
    <div className={`win-lose-container ${isGameWon ? "bg-green-500" : "bg-red-500"}`}>
            <div className={`${winLose}`}>
            {winLoseText}
            <div className="btn-container">
                <button onClick={tryAgain} className="btn btn--try-again">Try Again</button>
                <button onClick={exitGame} className="btn btn--exit">Exit Game</button>
            </div>
            </div>
    </div>
  )
}

export default WinLose