"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  const mode = useSearchParams().get("mode");
  const router = useRouter();
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [nameError, setNameError] = useState(false);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [moves, setMoves] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const startGame = () => 
  {
    if (!playerX || (mode === "2player" && !playerO)) 
    {
      setNameError(true);
      return;
    }

    setNameError(false);
    setBoard(emptyBoard);
    setWinnerInfo(null);
    setXIsNext(true);
    setMoves([]);
    setGameStarted(true);
    setTimer(0);
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    setIntervalId(id);
  };

  const handleClick = useCallback((i) => 
  {
    if (!gameStarted || board[i] || winnerInfo) return;

    const symbol = xIsNext ? "❌" : "⭕";
    const newBoard = [...board];
    newBoard[i] = symbol;
    setBoard(newBoard);
    setMoves((prev) => [...prev, `${symbol} ➝ ${i + 1}`]);

    const winner = calculateWinner(newBoard);
    if (winner) 
    {
      setWinnerInfo(winner);
      clearInterval(intervalId);
      setScores(prev => (
      {
        ...prev,
        [symbol === "❌" ? "X" : "O"]: prev[symbol === "❌" ? "X" : "O"] + 1
      }
      ));
      saveGameToHistory(
      {
        winner: winner.symbol,
        mode,
        moves: moves.length + 1,
        date: new Date().toLocaleString(),
        players: 
        {
          "❌": playerX,
          "⭕": playerO || "Computer"
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
          "❌": playerX,
          "⭕": playerO || "Computer"
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
  }, [xIsNext, board, winnerInfo, mode, gameStarted, handleClick]);

  const resetGame = () => 
  {
    clearInterval(intervalId);
    setGameStarted(false);
    setTimer(0);
    setBoard(emptyBoard);
    setWinnerInfo(null);
    setMoves([]);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="player-name left">
          <span className="emoji">❌</span>
          <span className="name">{playerX || "Player X"}</span>
          <span className="score-badge">{scores.X}</span>
        </div>
        <div className="game-mode">
          {mode === "computer" ? "🤖 Vs Computer" : "👥 2 Player Mode"}
        </div>
        <div className="player-name right">
          <span className="emoji">⭕</span>
          <span className="name">{playerO || (mode === "computer" ? "Computer" : "Player O")}</span>
          <span className="score-badge">{scores.O}</span>
        </div>
      </div>

      <div className="info-bar">
        <p>⏱ {gameStarted ? `${timer}s` : "Ready"}</p>
        <p>
          {winnerInfo
            ? `🎉 Winner: ${winnerInfo.symbol === "❌" ? playerX : (playerO || "Computer")}`
            : board.every(Boolean)
              ? "🤝 Draw!"
              : gameStarted
                ? `🕹️ Turn: ${xIsNext ? playerX : (playerO || "Computer")} (${xIsNext ? "❌" : "⭕"})`
                : "Click Start to Play"}
        </p>
      </div>

      <GameBoard
        board={board}
        onClick={handleClick}
        gameStarted={gameStarted}
        winningLine={winnerInfo?.line}
      />

      <div className="controls">
        {!gameStarted ? (
          <>
            <input
              type="text"
              placeholder="❌ Player X Name"
              value={playerX}
              onChange={(e) => {
                setPlayerX(e.target.value);
                setNameError(false);
              }}
            />
            {mode === "2player" && (
              <input
                type="text"
                placeholder="⭕ Player O Name"
                value={playerO}
                onChange={(e) => {
                  setPlayerO(e.target.value);
                  setNameError(false);
                }}
              />
            )}
            <button onClick={startGame}>▶️ Start Game</button>
          </>
        ) : (
          <>
            <button onClick={resetGame}>🔄 Reset</button>
            <button onClick={() => router.push("/")}>🏠 Home</button>
          </>
        )}
      </div>

      {nameError && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h4>⚠️ Name Required</h4>
            <p>Please enter player name before starting the game.</p>
            <button onClick={() => setNameError(false)}>OK</button>
          </div>
        </div>
      )}

      {moves.length > 0 && (
        <div className="history">
          <h4>🧾 Move History</h4>
          <ol>
            {moves.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
