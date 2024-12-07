function Square({value}) {
  return <button className="square">{value}</button>
}


export default function Board() {
  return(
    <>
      <div className="board-row">
        <Square value={"x"}/>
        <Square value={"x"}/>
        <Square value={"x"}/>
      </div>
      <div className="board-row">
        <button className="square"></button>
        <button className="square"></button>
        <button className="square"></button>
      </div>
      <div className="board-row">
        <button className="square"></button>
        <button className="square"></button>
        <button className="square"></button>
      </div>
    </>
  ) ;
}
