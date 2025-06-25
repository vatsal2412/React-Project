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

const saveGameToHistory = (entry) => 
{
  const prev = JSON.parse(localStorage.getItem("allGameHistory") || "[]");
  const updated = [...prev, entry];
  localStorage.setItem("allGameHistory", JSON.stringify(updated));
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

  const startGame = () => 
  {
    setBoard(emptyBoard);
    setWinnerInfo(null);
    setXIsNext(true);
    setMoves([]);
    setGameStarted(true);
    setTimer(0);
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    setIntervalId(id);
  };

  const handleClick = useCallback((i) => 
  {
    if (!gameStarted || board[i] || winnerInfo) return;

    const newBoard = [...board];
    const symbol = xIsNext ? "❌" : "⭕";
    newBoard[i] = symbol;
    setBoard(newBoard);
    setMoves([...moves, `${symbol} ➝ ${i + 1}`]);

    const winner = calculateWinner(newBoard);
    if (winner) 
      {
        setWinnerInfo(winner);
        clearInterval(intervalId);
        saveGameToHistory
        (
          {
            winner: winner.symbol,
            mode: mode,
            moves: moves.length + 1,
            date: new Date().toLocaleString()
          }
        );
      } 
    else if (newBoard.every(Boolean)) 
    {
      clearInterval(intervalId);
      saveGameToHistory
      (
        {
          winner: 'Draw',
          mode: mode,
          moves: moves.length + 1,
          date: new Date().toLocaleString()
        }
      );
    }
    setXIsNext(!xIsNext);
  }, [board, xIsNext, winnerInfo, gameStarted, intervalId, moves, mode]);

  useEffect(() => 
  {
    if (mode === "computer" && !xIsNext && !winnerInfo && gameStarted) 
    {
      const empty = board.map((val, i) => val ? null : i).filter(i => i !== null);
      const move = empty[Math.floor(Math.random() * empty.length)];
      setTimeout(() => handleClick(move), 500);
    }
  }, [mode, xIsNext, winnerInfo, board, gameStarted, handleClick]);

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
        {
          winnerInfo
            ? `🎉 Winner: ${winnerInfo.symbol}`
            : board.every(Boolean)
            ? "🤝 Draw!"
            : gameStarted
            ? `🕹️ Turn: ${xIsNext ? "❌" : "⭕"}`
            : "Click Start to Play"
        }
      </p>

      {gameStarted && <p>⏱ Time: {timer}s</p>}

      {
        !gameStarted && 
        (
          <button onClick={startGame}>▶️ Start Game</button>
        )
      }

      <GameBoard
        board={board}
        onClick={handleClick}
        gameStarted={gameStarted}
        winningLine={winnerInfo?.line}
      />

      <div className="controls">
        <button onClick={resetGame}>🔄 Reset</button>
        <button onClick={() => router.push("/")}>🏠 Home</button>
      </div>

      {
        moves.length > 0 && 
        (
          <div className="history">
            <h4>🧾 Move History</h4>
            <ol>
              {moves.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
          </div>
        )
      }
    </div>
  );
}
