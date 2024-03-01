import { useState } from "react";
import "./App.css";

import { MdOutlineRestartAlt } from "react-icons/md";
import { FaEraser } from "react-icons/fa";

import { createSudokuBoard } from "./utils";

function App() {
  const [grid, setGrid] = useState<number[][]>(createSudokuBoard());
  const [currPos, setCurrPos] = useState<{ row: number; col: number }>({
    row: 0,
    col: 0,
  });

  // @ts-ignore
  const [message, setMessage] = useState<string>("");

  const handleClick = (row: number, col: number) => {
    setCurrPos({ row, col });
  };

  const divs: JSX.Element[] = [];

  for (let i = 0; i < 9; i++) {
    const innerDivs: JSX.Element[] = [];
    for (
      let row = Math.floor(i / 3) * 3;
      row < Math.floor(i / 3) * 3 + 3;
      row++
    ) {
      for (let col = (i % 3) * 3; col < (i % 3) * 3 + 3; col++) {
        const cell = grid[row][col];

        const srow = Math.floor(currPos.row / 3) * 3;
        const scol = Math.floor(currPos.col / 3) * 3;

        const subgrid =
          row >= srow && row < srow + 3 && col >= scol && col < scol + 3;

        innerDivs.push(
          <div
            onClick={() => handleClick(row, col)}
            key={row + col * 3}
            className={`inner-box${cell === 0 ? "" : " initial"}${
              row === currPos.row || col === currPos.col || subgrid
                ? " selected"
                : ""
            }${row === currPos.row && col === currPos.col ? " curr" : ""}`}
          >
            {cell === 0 ? null : <span>{cell}</span>}
          </div>
        );
      }
    }

    divs.push(
      <div key={i} className="box">
        {innerDivs}
      </div>
    );
  }

  const options: JSX.Element[] = [];

  for (let i = 0; i < 9; i++) {
    options.push(
      <div key={i} className="option">
        {i + 1}
      </div>
    );
  }

  const handleReset = () => {
    setGrid(() => createSudokuBoard());
  };

  const handleErase = () => {
    const newGrid = [...grid];
    newGrid[currPos.row][currPos.col] = 0;

    setGrid(newGrid);
  };

  return (
    <main className="container">
      <h1>Sudoku</h1>
      <div className="game__container">
        <div className="game">{divs}</div>

        <div className="options-bar">
          <div className="options">{options}</div>

          <div className="btns">
            <button onClick={handleReset} aria-label="Restart">
              <MdOutlineRestartAlt size={24} />
            </button>
            <button onClick={handleErase} aria-label="Restart">
              <FaEraser size={24} />
            </button>
          </div>
        </div>
      </div>
      <h2 style={{ minHeight: "32px" }}>{message}</h2>
    </main>
  );
}

export default App;
