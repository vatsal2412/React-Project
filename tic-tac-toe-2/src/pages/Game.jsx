import React, { useState, useEffect, useCallback } from 'react';

const TicTacToe = () => 
{
    const emptyBoard = Array(9).fill(null);

    const [board, setBoard] = useState(emptyBoard);
    const [xIsNext, setXIsNext] = useState(true);
    const [winnerInfo, setWinnerInfo] = useState(null);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [history, setHistory] = useState([]);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [vsComputer, setVsComputer] = useState(true);
    const [gameStarted, setGameStarted] = useState(false); // Controls whether game has started

    // Start the timer only when game is started
    useEffect(() => 
      {
        if (!gameStarted) return;
        const id = setInterval(() => setTimer(t => t + 1), 1000);
        setIntervalId(id);
        return () => clearInterval(id);
      }, [gameStarted]);

    // Handle square clicks
    const handleClick = useCallback((i) => {
      if (!gameStarted || board[i] || winnerInfo) return;

      const newBoard = [...board];
      newBoard[i] = xIsNext ? 'X' : 'O';
      setBoard(newBoard);
      setHistory([...history, newBoard]);

      const winner = calculateWinner(newBoard);
      if (winner) 
      {
        setWinnerInfo(winner);
        clearInterval(intervalId);
        setScores(prev => (
          {
            ...prev,
            [winner.symbol]: prev[winner.symbol] + 1,
          }));
      } 
      else if (newBoard.every(Boolean)) 
      {
        clearInterval(intervalId);
      }

      setXIsNext(!xIsNext);
    }, [board, xIsNext, winnerInfo, intervalId, history, gameStarted]);

    // computer move
    const makeComputerMove = useCallback(() => 
    {
      const emptyIndices = board
        .map((val, i) => (val ? null : i))
        .filter(i => i !== null);

      const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      if (move !== undefined) 
      {
        handleClick(move);
      }
    }, [board, handleClick]);

    // Trigger computer move when it's computer's turn
    useEffect(() => 
    {
      if (gameStarted && vsComputer && !xIsNext && !winnerInfo) 
      {
        const timeout = setTimeout(makeComputerMove, 500);
        return () => clearTimeout(timeout);
      }
    }, [vsComputer, xIsNext, winnerInfo, makeComputerMove, gameStarted]);

    // Reset the game
    const resetGame = () => 
    {
      setBoard(emptyBoard);
      setWinnerInfo(null);
      setXIsNext(true);
      setTimer(0);
      setHistory([]);
      setGameStarted(false);
    };

    // Render each square (with highlight if it's a winning cell)
    const renderSquare = (i) => 
    {
      const highlight = winnerInfo?.line?.includes(i);
      return (
        <button
          className={`square ${highlight ? 'highlight' : ''}`}
          onClick={() => handleClick(i)}
          disabled={!gameStarted || board[i] || winnerInfo}
        >
          {board[i]}
        </button>
      );
    };

    return (
      <div className="game">
        <h2>Tic Tac Toe</h2>

        <div className="info">
          <p>⏱ Timer: {timer}s</p>
          <p>🏆 Score — X: {scores.X} | O: {scores.O}</p>
          <p>
            {winnerInfo
              ? `🎉 Winner: ${winnerInfo.symbol}`
              : board.every(Boolean)
              ? '🤝 Draw!'
              : gameStarted
              ? `🕹️ Next Turn: ${xIsNext ? 'X' : 'O'}`
              : '🎮 Click "Start Game" to begin'}
          </p>
        </div>

        {/* Game Board */}
        <div className={`board ${!gameStarted ? 'disabled' : ''}`}>
          {[0, 3, 6].map(row => (
            <div key={row} className="row">
              {renderSquare(row)}
              {renderSquare(row + 1)}
              {renderSquare(row + 2)}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="controls">
          {!gameStarted && (
            <button onClick={() => setGameStarted(true)}>🎮 Start Game</button>
          )}
          <button onClick={resetGame}>🔄 Reset</button>
          <button onClick={() => setVsComputer(!vsComputer)}>
            Mode: {vsComputer ? 'Vs Computer 🤖' : '2 Player 👥'}
          </button>
        </div>

        {/* Move History */}
        <div className="history">
          <h4>🧾 Move History:</h4>
          {
            history.map((b, i) => (
              <div key={i}>
                #{i + 1}: {b.map((val) => val || "-").join(" ")}
              </div>
            ))
          }
        </div>
      </div>
    );
};

  // Utility to check winner from board state
  const calculateWinner = (squares) => 
  {
    const lines = 
    [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6],           // Diagonals
    ];

    for (let line of lines) 
    {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) 
      {
        return { symbol: squares[a], line };
      }
    }
    return null;
  };

  export default TicTacToe;
