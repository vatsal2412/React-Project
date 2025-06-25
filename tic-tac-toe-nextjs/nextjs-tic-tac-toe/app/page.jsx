"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "../styles/globals.css";

export default function Home() 
{
  const router = useRouter();
  const [allGames, setAllGames] = useState([]);

  const startGame = (mode) => 
  {
    router.push(`/game?mode=${mode}`);
  };

  useEffect(() => 
  {
    if (typeof window !== "undefined") 
    {
      const stored = JSON.parse(localStorage.getItem("allGameHistory")) || [];
      setAllGames(stored);
    }
  }, []);

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
            {
              allGames.map((game, i) => (
              <li key={i}>
                {game.date} — <strong>{game.mode}</strong> —  {game.winner} in {game.moves} moves
              </li>
              ))
            }
          </ol>
          <button onClick={clearHistory}>🗑️ Clear History</button>
        </div>
        )
      }
    </div>
  );
}
