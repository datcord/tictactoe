import { useState } from "react";
import ParticlesComponent from './Particles';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function calcWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every((square) => square)) {
    return "draw";
  }
  return null;
}

function WinningSymbols({ symbol }) {
  // Create 10 symbols with random positions and animations
  const symbols = Array(10).fill(null).map((_, i) => (
    <div 
      key={i} 
      className="flying-symbol"
      style={{
        '--delay': `${Math.random() * 2}s`,
        '--duration': `${4 + Math.random() * 2}s`,
        '--start-x': `${Math.random() * 100}vw`,
        '--start-y': `${Math.random() * 100}vh`,
        '--end-x': `${Math.random() * 100}vw`,
        '--end-y': `${Math.random() * 100}vh`,
      }}
    >
      {symbol}
    </div>
  ));

  return <div className="flying-symbols-container">{symbols}</div>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const startState = Array(9).fill(null);
  const [turn, setTurn] = useState(true); //true is X
  const [gameMode, setGameMode] = useState(null); // null = not selected, 'single' or 'multi'
  const [difficulty, setDifficulty] = useState(null); // new state for difficulty level
  const [lastMove, setLastMove] = useState(null); // Track the last move position
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  // Add these new helper functions for the computer's AI
  function getWinningMove(board, player) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] === player && board[b] === player && board[c] === null) return c;
      if (board[a] === player && board[c] === player && board[b] === null) return b;
      if (board[b] === player && board[c] === player && board[a] === null) return a;
    }
    return null;
  }

  function minimax(board, depth, isMaximizing) {
    const winner = calcWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function getBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  function computerMove() {
    setSquares(currentSquares => {
      let movePosition;

      if (difficulty === 'easy') {
        // Random move (current implementation)
        const availableMoves = currentSquares.map((square, index) => 
          square === null ? index : null
        ).filter(move => move !== null);
        
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        movePosition = availableMoves[randomIndex];
      } 
      else if (difficulty === 'medium') {
        // First try to win, then block opponent, then random move
        movePosition = getWinningMove(currentSquares, 'O'); // Try to win
        
        if (movePosition === null) {
          movePosition = getWinningMove(currentSquares, 'X'); // Try to block
        }
        
        if (movePosition === null) {
          // Make a random move
          const availableMoves = currentSquares.map((square, index) => 
            square === null ? index : null
          ).filter(move => move !== null);
          const randomIndex = Math.floor(Math.random() * availableMoves.length);
          movePosition = availableMoves[randomIndex];
        }
      }
      else if (difficulty === 'hard') {
        // Use minimax algorithm for best possible move
        movePosition = getBestMove(currentSquares.slice());
      }

      if (movePosition === null) return currentSquares;

      const nextState = currentSquares.slice();
      nextState[movePosition] = 'O';
      setLastMove({ position: movePosition, symbol: 'O' });
      
      const result = calcWinner(nextState);
      if (result && result !== 'draw') {
        setShowWinAnimation(true);
      }
      
      return nextState;
    });
    setTurn(true);
  }

  function handleClick(i) {
    if (squares[i] || calcWinner(squares)) {
      return;
    }
    const nextState = squares.slice();
    if (gameMode === 'single') {
      nextState[i] = 'X';
      setSquares(nextState);
      setLastMove({ position: i, symbol: 'X' });
      setTurn(false);
      
      const result = calcWinner(nextState);
      if (result && result !== 'draw') {
        setShowWinAnimation(true);
      } else if (!result) {
        setTimeout(() => {
          if (!calcWinner(nextState)) {
            computerMove();
          }
        }, 500);
      }
    } else {
      // Two player mode
      nextState[i] = turn ? 'X' : 'O';
      setSquares(nextState);
      setLastMove({ position: i, symbol: turn ? 'X' : 'O' });
      setTurn(!turn);
      
      const result = calcWinner(nextState);
      if (result && result !== 'draw') {
        setShowWinAnimation(true);
      }
    }
  }

  const winner = calcWinner(squares);
  let status;
  if (winner) {
    status = winner === "draw" ? "It's a draw!" : "Winner: " + winner;
  } else {
    status = gameMode === 'single' 
      ? (turn ? "Your turn (X)" : "Computer thinking...")
      : "Next player: " + (turn ? 'X' : 'O');
  }

  function handleWinAnimationClick() {
    setShowWinAnimation(false);
  }

  if (!gameMode) {
    return (
      <>
        <h1>TIC TAC TOE</h1>
        <ParticlesComponent id="particles" />
        <div id="mode-selection">
          <h2>Select Game Mode</h2>
          <button onClick={() => setGameMode('multi')}>Two Players</button>
          <div className="single-player-options">
            <h3>Single Player</h3>
            <button onClick={() => {
              setGameMode('single');
              setDifficulty('easy');
            }}>Easy</button>
            <button onClick={() => {
              setGameMode('single');
              setDifficulty('medium');
            }}>Medium</button>
            <button onClick={() => {
              setGameMode('single');
              setDifficulty('hard');
            }}>Hard</button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <h1>TIC TAC TOE</h1>
      <ParticlesComponent id="particles" />
      <div id="status">{status}</div>
      <div id="game">
        {[0, 3, 6].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2].map((col) => (
              <Square key={row + col} value={squares[row + col]} onSquareClick={() => handleClick(row + col)} />
            ))}
          </div>
        ))}
      </div>
      {showWinAnimation && lastMove && (
        <div className="winner-overlay" onClick={handleWinAnimationClick}>
          <div className="winner-text">WINNER!</div>
          <div className="winning-symbol">{lastMove.symbol}</div>
          <WinningSymbols symbol={lastMove.symbol} />
          <div className="click-to-continue">Click anywhere to continue</div>
        </div>
      )}
      <button id="startOverBtn" onClick={() => {
        setSquares(startState);
        setTurn(true);
        setGameMode(null);
        setShowWinAnimation(false);
        setLastMove(null);
      }}>Start over</button>
    </>
  );
}
