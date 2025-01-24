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
  const [lastMove, setLastMove] = useState(null); // Track the last move position
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  function computerMove() {
    // Use a callback to ensure we have the latest state
    setSquares(currentSquares => {
      // Find available moves
      const availableMoves = currentSquares.map((square, index) => 
        square === null ? index : null
      ).filter(move => move !== null);
      
      if (availableMoves.length === 0) return currentSquares;
      
      // Make random move
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const movePosition = availableMoves[randomIndex];
      
      const nextState = currentSquares.slice();
      nextState[movePosition] = 'O';
      setLastMove({ position: movePosition, symbol: 'O' });
      
      if (calcWinner(nextState)) {
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
      
      if (calcWinner(nextState)) {
        setShowWinAnimation(true);
      } else {
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
      
      if (calcWinner(nextState)) {
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
          <button onClick={() => setGameMode('single')}>Single Player</button>
          <button onClick={() => setGameMode('multi')}>Two Players</button>
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
