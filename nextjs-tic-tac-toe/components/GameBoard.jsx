import React from "react";

const GameBoard = ({ board, onClick, gameStarted, winningLine = [] }) => 
{
  return (
    <div className={`board ${!gameStarted ? "disabled" : ""}`}>
      {
        board.map((cell, i) => (
          <div
            key={i}
            className={`square ${winningLine.includes(i) ? "highlight" : ""}`}
            onClick={() => onClick(i)}
          >
            {cell}
          </div>
        ))
      }
    </div>
  );
};

export default GameBoard;
