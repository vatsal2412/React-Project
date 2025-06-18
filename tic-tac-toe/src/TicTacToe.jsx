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
    const [vsAI, setVsAI] = useState(true);

    // Start the game timer on initial render
    useEffect(() => 
    {
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }, []);

    // Handle player's move
    const handleClick = useCallback((i) => 
    {
      if (board[i] || winnerInfo) return; // Prevent moves if cell is filled or game is over

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
          clearInterval(intervalId); // Stop timer on draw
        }

      setXIsNext(!xIsNext);
    }, [board, xIsNext, winnerInfo, intervalId, history]);

    // AI makes a random move when it's its turn
    const makeAIMove = useCallback(() => 
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

    // AI move trigger when it's AI's turn
    useEffect(() => 
    {
      if (vsAI && !xIsNext && !winnerInfo) 
      {
        const timeout = setTimeout(makeAIMove, 500); // Slight delay for realism
        return () => clearTimeout(timeout);
      }
    }, [vsAI, xIsNext, winnerInfo, makeAIMove]);

    // Reset the game to initial state
    const resetGame = () => 
    {
      setBoard(emptyBoard);
      setWinnerInfo(null);
      setXIsNext(true);
      setTimer(0);
      setHistory([]);
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntervalId(id);
    };

    // Render each square of the board with optional highlight
    const renderSquare = (i) => 
    {
      const highlight = winnerInfo?.line?.includes(i);
      return (
        <button
          className={`square ${highlight ? 'highlight' : ''}`}
          onClick={() => handleClick(i)}
        >
          {board[i]}
        </button>
      );
    };

    return (
      <div className="game">
        <h2>Tic Tac Toe</h2>

        <div className="info">
          <p> Timer: {timer}s</p>
          <p> Score — X: {scores.X} | O: {scores.O}</p>
          <p>
            {winnerInfo
              ? ` Winner: ${winnerInfo.symbol}`
              : board.every(Boolean)
              ? ' Draw!'
              : `Next Turn: ${xIsNext ? 'X' : 'O'}`}
          </p>
        </div>

        <div className="board">
          {[0, 3, 6].map(row => (
            <div key={row} className="row">
              {renderSquare(row)}
              {renderSquare(row + 1)}
              {renderSquare(row + 2)}
            </div>
          ))}
        </div>

        <div className="controls">
          <button onClick={resetGame}> Reset</button>
          <button onClick={() => setVsAI(!vsAI)}>
            Mode: {vsAI ? 'Vs AI ' : '2 Player '}
          </button>
        </div>

        <div className="history">
          <h4>Move History:</h4>
          {history.map((b, i) => (
            <div key={i}>
              #{i + 1}: {b.map((val, j) => val || "-").join(" ")}
            </div>
          ))}
        </div>
      </div>
    );
};

  // Function to check if there is a winner
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
        return { symbol: squares[a], line }; // Return winning symbol and line
      }
    }

    return null; // No winner
  };

  export default TicTacToe;
