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
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const startState = Array(9).fill(null);
  const [turn, setTurn] = useState(true); //true is X
  
  function handleClick(i) {
    if (squares[i]||calcWinner(squares)) {
      return;
    }
    const nextState = squares.slice();
    if (turn) {
      nextState[i] = 'X';
    } else {
      nextState[i] = 'O';
    }
    setSquares(nextState);
    setTurn(!turn);
  }
  const winner = calcWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (turn ? 'X' : 'O') ;
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
      <button id="startOverBtn" onClick={() => {
        setSquares(startState);
        setTurn(true);
      }}>Start over</button>
    </>
  );
}
