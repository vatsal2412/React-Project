"use client";
import { useRouter } from "next/navigation";
import "../styles/globals.css";

export default function Home() 
{
  const router = useRouter();

  const startGame = (mode) => 
  {
    router.push(`/game?mode=${mode}`);
  };

  return (
    <div className="container">
      <h1>🎮 Tic Tac Toe</h1>
      <p>Select a mode to begin:</p>
      <div className="mode-buttons">
        <button onClick={() => startGame("computer")}>Vs Computer 🤖</button>
        <button onClick={() => startGame("2player")}>2 Player 👥</button>
      </div>
    </div>
  );
}
