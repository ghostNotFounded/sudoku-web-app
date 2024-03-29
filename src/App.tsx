import { useEffect, useState } from "react";
import "./App.css";
import {
  completedSudoku,
  createSudokuBoard,
  initialNumber,
  isValidSudoku,
  timeFormatter,
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
  const [message, setMessage] = useState<string>("");
  const [mistakes, setMistakes] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    let timer: number;
    if (!gameFinished) {
      timer = setTimeout(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  });

  const handleClick = (row: number, col: number) => {
    if (!initialNumber(originalGrid, row, col) && !message) {
      setCurrPos({ row, col });
    }
  };

  const handleOptionClick = (num: number) => {
    if (!message && !initialNumber(originalGrid, currPos.row, currPos.col)) {
      if (!isValidSudoku(grid, currPos.row, currPos.col, num)) {
        setMistakes((prev) => {
          if (prev + 1 >= 3) {
            setMessage("Oops! Too many mistakes, try again!");
            setGameFinished(true);
          }
          return prev + 1;
        });
      }
      const newGrid = [...grid];
      newGrid[currPos.row][currPos.col] = num;
      setGrid(newGrid);
      if (completedSudoku(grid)) {
        setMessage("🎉 You solved the Sudoku! 🎉");
        setGameFinished(true);
      }
    }
  };

  const handleReset = () => {
    const newGrid = createSudokuBoard();

    setGrid(newGrid);
    setOriginalGrid(() => JSON.parse(JSON.stringify(newGrid)));

    setMessage("");
    setMistakes(0);
    setGameFinished(false);
    setTime(0);
  };

  const handleErase = () => {
    if (!initialNumber(originalGrid, currPos.row, currPos.col)) {
      const newGrid = [...grid];
      newGrid[currPos.row][currPos.col] = 0;
      setGrid(newGrid);
    }
  };

  const divs = [];
  for (let i = 0; i < 9; i++) {
    const innerDivs = [];
    for (
      let row = Math.floor(i / 3) * 3;
      row < Math.floor(i / 3) * 3 + 3;
      row++
    ) {
      for (let col = (i % 3) * 3; col < (i % 3) * 3 + 3; col++) {
        const cell = grid[row][col];
        const srow = Math.floor(currPos.row / 3) * 3;
        const scol = Math.floor(currPos.col / 3) * 3;
        const val = grid[currPos.row][currPos.col];
        const subgrid =
          row >= srow && row < srow + 3 && col >= scol && col < scol + 3;
        innerDivs.push(
          <div
            onClick={() => handleClick(row, col)}
            style={{
              color: `${
                !isValidSudoku(grid, row, col, cell)
                  ? "red"
                  : initialNumber(originalGrid, row, col)
                  ? "yellow"
                  : "white"
              }`,
            }}
            key={row + col * 3}
            className={`inner-box${
              row === currPos.row || col === currPos.col || subgrid
                ? " selected"
                : ""
            }${
              (val === cell && val !== 0) ||
              (row === currPos.row && col === currPos.col)
                ? " curr"
                : ""
            }${
              initialNumber(originalGrid, row, col) || message
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

  const options = [];
  for (let i = 0; i < 9; i++) {
    options.push(
      <div key={i} className="option" onClick={() => handleOptionClick(i + 1)}>
        {i + 1}
      </div>
    );
  }

  return (
    <main className="container">
      <h1>Sudoku</h1>
      <div className="game__container">
        <div className="game">{divs}</div>
        <div className="options-bar">
          <div className="stats">
            <p>
              <span style={{ color: "red" }}>Mistakes: </span>
              <span>{mistakes} / 3</span>
            </p>
            <p>
              <span style={{ color: "yellow" }}>Time: </span>
              <span>{timeFormatter(time)}</span>
            </p>
          </div>
          <div className="options">{options}</div>
          <div className="btns">
            <button onClick={handleReset} aria-label="Restart">
              Restart
            </button>
            <button
              onClick={handleErase}
              aria-label="Restart"
              disabled={message.length > 0}
            >
              Erase
            </button>
          </div>
        </div>
      </div>
      <h2 style={{ minHeight: "32px" }}>{message}</h2>
    </main>
  );
}

export default App;
