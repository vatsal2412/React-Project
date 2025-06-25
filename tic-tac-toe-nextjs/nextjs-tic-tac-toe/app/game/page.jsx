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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) 
    {
      return { symbol: squares[a], line: [a, b, c] };
    }
  }
  return null;
};

const saveGameToHistory = (entry) => 
{
  const prev = JSON.parse(localStorage.getItem("allGameHistory") || "[]");
  localStorage.setItem("allGameHistory", JSON.stringify([...prev, entry]));
};

export default function Game() 
{
  const params = useSearchParams();
  const mode = params.get("mode");
  const router = useRouter();
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
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
    const symbol = xIsNext ? "❌" : "⭕";
    const newBoard = [...board];
    newBoard[i] = symbol;
    setBoard(newBoard);
    setMoves(prev => [...prev, `${symbol} ➝ ${i + 1}`]);

    const winner = calculateWinner(newBoard);
    if (winner) 
    {
      setWinnerInfo(winner);
      clearInterval(intervalId);
      saveGameToHistory(
      {
        winner: winner.symbol,
        mode,
        moves: moves.length + 1,
        date: new Date().toLocaleString(),
        players: 
        {
          "❌": playerX || "Player X",
          "⭕": playerO || (mode === "computer" ? "Computer" : "Player O")
        }
      });
    } 
    else if (newBoard.every(Boolean)) 
    {
      clearInterval(intervalId);
      saveGameToHistory(
      {
        winner: "Draw",
        mode,
        moves: moves.length + 1,
        date: new Date().toLocaleString(),
        players: 
        {
          "❌": playerX || "Player X",
          "⭕": playerO || (mode === "computer" ? "Computer" : "Player O")
        }
      });
    }

    setXIsNext(!xIsNext);
  }, [board, xIsNext, winnerInfo, gameStarted, intervalId, moves.length, playerX, playerO, mode]);

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
    setGameStarted(false);
    setTimer(0);
    clearInterval(intervalId);
    setBoard(emptyBoard);
    setWinnerInfo(null);
    setMoves([]);
  };

  return (
    <div className="container">
      <h2>{mode === "computer" ? "Vs Computer 🤖" : "2 Player 👥"}</h2>

      {!gameStarted && (
        <>
          <h4>👤 Enter Player Name{mode === "2player" ? "s" : ""}</h4>
          <input
            type="text"
            placeholder="❌ Player X"
            value={playerX}
            onChange={(e) => setPlayerX(e.target.value)}
          />
          {mode === "2player" && (
            <input
              type="text"
              placeholder="⭕ Player O"
              value={playerO}
              onChange={(e) => setPlayerO(e.target.value)}
            />
          )}
          <button
            onClick={startGame}
            disabled={!playerX || (mode === "2player" && !playerO)}
          >
            ▶️ Start Game
          </button>
        </>
      )}

      <p>
        {
          winnerInfo
            ? `🎉 Winner: ${winnerInfo.symbol === "❌" ? playerX : (playerO || "Computer")} (${winnerInfo.symbol})`
            : board.every(Boolean)
              ? "🤝 Draw!"
              : gameStarted
                ? `🕹️ Turn: ${xIsNext ? playerX : (playerO || "Computer")} (${xIsNext ? "❌" : "⭕"})`
                : "Click Start to Play"
        }
      </p>

      {gameStarted && <p>⏱ Time: {timer}s</p>}

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

      {moves.length > 0 && (
        <div className="history">
          <h4>🧾 Move History</h4>
          <ol>{moves.map((m, i) => <li key={i}>{m}</li>)}</ol>
        </div>
      )}
    </div>
  );
}
