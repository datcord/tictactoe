import { useState } from "react";

// eslint-disable-next-line react/prop-types
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
  return null;
}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const startState = Array(9).fill(null);
  const [turn, setTurn] = useState(true);//true is X
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
      <div>{status}</div>
      <div id="game">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
      <div>
        <button id="startOverBtn" onClick={() => {
            setSquares(startState);
            setTurn(true);
          }} onMouseEnter={() => {
            document.getElementById("startOverBtn").style.backgroundColor = "slategrey";
            document.getElementById("startOverBtn").style.color = "black";
          }} onMouseOut={() => {
            document.getElementById("startOverBtn").style.backgroundColor = "darkslategrey";
            document.getElementById("startOverBtn").style.color = "beige";
          }}>Start over</button>
      </div>
    </>
  );
}
