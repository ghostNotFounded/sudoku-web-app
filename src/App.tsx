import { useState } from "react";
import "./App.css";

import { MdOutlineRestartAlt } from "react-icons/md";
import { FaEraser } from "react-icons/fa";

import {
  completedSudoku,
  createSudokuBoard,
  initialNumber,
  isValidSudoku,
} from "./utils";

function App() {
  const initialGrid = createSudokuBoard();
  const [grid, setGrid] = useState<number[][]>(initialGrid);
  const [originalGrid, setOriginalGrid] = useState<number[][]>(() =>
    JSON.parse(JSON.stringify(initialGrid))
  );

  const [currPos, setCurrPos] = useState<{ row: number; col: number }>({
    row: 0,
    col: 0,
  });

  // @ts-ignore
  const [message, setMessage] = useState<string>("");

  const handleClick = (row: number, col: number) => {
    if (!initialNumber(originalGrid, row, col) && message.length === 0) {
      setCurrPos({ row, col });
    }
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
            style={{
              color: `${isValidSudoku(grid, row, col, cell) ? "white" : "red"}`,
            }}
            key={row + col * 3}
            className={`inner-box${
              row === currPos.row || col === currPos.col || subgrid
                ? " selected"
                : ""
            }${row === currPos.row && col === currPos.col ? " curr" : ""}${
              initialNumber(originalGrid, row, col) || message.length !== 0
                ? " original"
                : ""
            }`}
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

  const handleOptionClick = (num: number) => {
    if (message.length === 0) {
      const newGrid = [...grid];
      newGrid[currPos.row][currPos.col] = num;

      setGrid(newGrid);
    }

    if (completedSudoku(grid)) {
      setMessage("🎉 You solved the Sudoku! 🎉");
    }
  };

  const options: JSX.Element[] = [];

  for (let i = 0; i < 9; i++) {
    options.push(
      <div key={i} className="option" onClick={() => handleOptionClick(i + 1)}>
        {i + 1}
      </div>
    );
  }

  const handleReset = () => {
    const newGrid = createSudokuBoard();
    setGrid(() => newGrid);

    setOriginalGrid(() => JSON.parse(JSON.stringify(newGrid)));

    setMessage("");
  };

  const handleErase = () => {
    if (!initialNumber(originalGrid, currPos.row, currPos.col)) {
      const newGrid = [...grid];
      newGrid[currPos.row][currPos.col] = 0;

      setGrid(newGrid);
    }
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
