"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import "../../styles/globals.css";
import GameBoard from "../../components/GameBoard";

const emptyBoard = Array(9).fill(null);

const calculateWinner = (squares) => 
{
  const lines = 
  [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) 
  {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) 
      {
        return { symbol: squares[a], line: [a, b, c] };
      }
  }
  return null;
};

export default function Game() 
{
  const params = useSearchParams();
  const mode = params.get("mode");
  const router = useRouter();
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [moves, setMoves] = useState([]);

  //  Start the timer when game starts
  const startGame = () => 
  {
    setBoard(emptyBoard);
    setWinnerInfo(null);
    setXIsNext(true);
    setMoves([]);
    setGameStarted(true);
    setTimer(0);
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    setIntervalId(id);
  };

  //  Handle player or computer move
  const handleClick = useCallback(
    (i) => 
    {
      if (!gameStarted || board[i] || winnerInfo) return;
      const newBoard = [...board];
      const symbol = xIsNext ? "❌" : "⭕";
      newBoard[i] = symbol;
      setBoard(newBoard);
      setMoves([...moves, `${symbol} ➝ ${i + 1}`]); //  Track move number
      const winner = calculateWinner(newBoard);
      if (winner) 
      {
        setWinnerInfo(winner);
        clearInterval(intervalId);
      }

      setXIsNext(!xIsNext);
    },
    [board, xIsNext, winnerInfo, gameStarted, intervalId, moves]
  );

  // Computer makes random move if in that mode
  useEffect(() => 
    {
      if (mode === "computer" && !xIsNext && !winnerInfo && gameStarted) 
      {
        const empty = board.map((val, i) => (val ? null : i)).filter((i) => i !== null);
        const move = empty[Math.floor(Math.random() * empty.length)];
        setTimeout(() => handleClick(move), 500);
      }
    }, [mode, xIsNext, winnerInfo, board, gameStarted, handleClick]);

  //  Reset the board and timer
  const resetGame = () => 
  {
    setBoard(emptyBoard);
    setWinnerInfo(null);
    setXIsNext(true);
    setMoves([]);
    setGameStarted(false);
    setTimer(0);
    clearInterval(intervalId);
  };

  return (
    <div className="container">
      <h2>{mode === "computer" ? "Vs Computer 🤖" : "2 Player 👥"}</h2>

      <p>
        {winnerInfo
          ? `🎉 Winner: ${winnerInfo.symbol}`
          : board.every(Boolean)
          ? "🤝 Draw!"
          : gameStarted
          ? `🕹️ Turn: ${xIsNext ? "❌" : "⭕"}`
          : "Click Start to Play"}
      </p>

      {gameStarted && <p>⏱ Time: {timer}s</p>}

      {!gameStarted && <button onClick={startGame}>▶️ Start Game</button>}

      <GameBoard
        board={board}
        onClick={handleClick}
        gameStarted={gameStarted}
        winningLine={winnerInfo?.line}
      />

      <div className="controls">
        <button onClick={resetGame}>🔄 Reset</button>
        <button onClick={() => router.push("/")}>🏠 Back to Home</button>
      </div>

      {/*  Move History */}
      {
        moves.length > 0 && (
        <div className="history">
          <h4>📝 Move History</h4>
          <ol>
            {moves.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ol>
        </div>)
      }
    </div>
  );
}
