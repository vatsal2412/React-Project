import React from 'react';

const GameBoard = ({ board, onClick, gameStarted, setGameStarted }) => 
{
  return 
  (
    <div className="game-board-wrapper">
      {!gameStarted && 
        (
          <button className="start-button" onClick={() => setGameStarted(true)}>
            🎮 Start Game
          </button>
        )
      }

      <div className={`board ${!gameStarted ? 'disabled' : ''}`}>
        {
          board.map((value, index) => (
            <div
              key={index}
              className="square"
              onClick={() => gameStarted && onClick(index)}
            >
              {value}
             </div>
          ))
        }
      </div>
    </div>
  );
};

export default GameBoard;
