// src/components/Game.js
import React, { useState } from "react";

const calculateWinner = (squares) => {
  const lines = generateWinningLines(33, 5);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[a] === squares[d] &&
      squares[a] === squares[e]
    ) {
      return { winner: squares[a], line: [a, b, c, d, e] };
    }
  }

  return null;
};

const generateWinningLines = (size, winLength) => {
  const lines = [];

  // Horizontal lines
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const line = Array.from({ length: winLength }, (_, index) => i * size + j + index);
      lines.push(line);
    }
  }

  // Vertical lines
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const line = Array.from({ length: winLength }, (_, index) => (j + index) * size + i);
      lines.push(line);
    }
  }

  // Diagonal lines (top-left to bottom-right)
  for (let i = 0; i <= size - winLength; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const line = Array.from({ length: winLength }, (_, index) => (i + index) * size + j + index);
      lines.push(line);
    }
  }

  // Diagonal lines (top-right to bottom-left)
  for (let i = 0; i <= size - winLength; i++) {
    for (let j = winLength - 1; j < size; j++) {
      const line = Array.from({ length: winLength }, (_, index) => (i + index) * size + j - index);
      lines.push(line);
    }
  }

  return lines;
};

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(33 * 16).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [totalGames, setTotalGames] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const current = history[stepNumber];

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const currentSquares = [...current.squares];

    if (calculateWinner(currentSquares) || currentSquares[i] || isGameOver) {
      return;
    }

    currentSquares[i] = xIsNext ? "X" : "O";

    setHistory([...newHistory, { squares: currentSquares }]);
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(currentSquares);
    if (winner) {
      setWinnerInfo(winner);
      setScore((prevScore) => ({
        ...prevScore,
        [winner.winner]: prevScore[winner.winner] + 1,
      }));
      setIsGameOver(true);
    } else if (newHistory.length === 33 * 16) {
      setIsGameOver(true);
    }
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
    setWinnerInfo(null);
    setIsGameOver(false);
  };

  const resetGame = () => {
    setHistory([{ squares: Array(33 * 16).fill(null) }]);
    setStepNumber(0);
    setXIsNext(true);
    setWinnerInfo(null);
    setIsGameOver(false);
  };

  const handleRestartGame = () => {
    setTotalGames((prevTotalGames) => prevTotalGames + 1);
    resetGame();
  };

  const renderSquare = (i) => {
    const isWinnerSquare = winnerInfo && winnerInfo.line.includes(i);
    const squareStyle = isWinnerSquare
      ? { background: '#c5e1a5', color: '#1b5e20' }
      : {};

    return (
      <button
        key={i}
        className="square"
        style={squareStyle}
        onClick={() => handleClick(i)}
      >
        {current.squares[i] === 'O' && isWinnerSquare ? (
          <span style={{ color: '#1b5e20' }}>{current.squares[i]}</span>
        ) : (
          current.squares[i]
        )}
      </button>
    );
  };

  const renderRow = (rowIndex) => {
    const row = [];
    for (let i = 0; i < 33; i++) {
      row.push(renderSquare(rowIndex * 33 + i));
    }
    return row;
  };

  const renderBoard = () => {
    const board = [];
    for (let i = 0; i < 16; i++) {
      board.push(
        <div key={i} className="board-row">
          {renderRow(i)}
        </div>
      );
    }
    return board;
  };

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const status = winnerInfo
    ? `Winner: ${winnerInfo.winner}`
    : isGameOver
    ? "It's a draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="game-info d-flex align-items-center justify-content-between mb-3">
        <div className="mr-2">{status}</div>
        <div className="mr-2">Total Games: {totalGames}</div>
        <div className="mr-2">Score: X = {score.X}</div>
        <div className="mr-2">Score: O = {score.O}</div>
        <button className="btn" onClick={handleRestartGame}>
          Restart Game
        </button>
      </div>
      <div className="game">
        <div className="game-board">{renderBoard()}</div>
      </div>
    </>
  );
};

export default Game;
