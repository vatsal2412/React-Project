"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "../styles/globals.css";

export default function Home() 
{
  const router = useRouter();
  const [allGames, setAllGames] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("allGameHistory")) || [];
    setAllGames(stored);
}, []);

  const startGame = (mode) => 
  {
    router.push(`/game?mode=${mode}`);
  };

  const clearHistory = () => 
  {
    localStorage.removeItem("allGameHistory");
    setAllGames([]);
  };

  return (
    <div className="container">
      <h1>🎮 Tic Tac Toe</h1>
      <p>Select a mode to begin:</p>
      <div className="mode-buttons">
        <button onClick={() => startGame("computer")}>Vs Computer 🤖</button>
        <button onClick={() => startGame("2player")}>2 Player 👥</button>
      </div>

{
  allGames.length > 0 && (
        <div className="history">
          <h4>📜 Game History</h4>
          <ol>
            {allGames.map((g, i) => (
              <li key={i}>
                {g.date} — <strong>{g.mode}</strong> — {" "}
                {g.winner === "Draw"
                  ? "Draw"
                  : `${g.winner} (${g.players?.[g.winner] || "Unknown"})`}{" "}
                in {g.moves} moves
              </li>
            ))}
          </ol>
          <button onClick={clearHistory}>🗑️ Clear History</button>
        </div>
      )}
    </div>
  );
}
