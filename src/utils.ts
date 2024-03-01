// Function to create a solved Sudoku board
export function createSudokuBoard(): number[][] {
  // Create a 9x9 array filled with zeros
  const board: number[][] = new Array(9)
    .fill(null)
    .map(() => new Array(9).fill(0));

  // Function to check if a number can be placed in a certain position
  function isValid(
    board: number[][],
    row: number,
    col: number,
    num: number
  ): boolean {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }
    // Check column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }
    // Check subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  // Function to solve the Sudoku board using backtracking
  function solve(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const shuffledNums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of shuffledNums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Shuffle function
  function shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Solve the Sudoku board
  solve(board);

  let newBoard: number[][] = [];

  for (let row of board) {
    let newRow: number[] = [];
    for (let num of row) {
      if (Math.random() < 0.5) {
        // Randomly decide whether to keep the number or make it empty
        newRow.push(0); // Add empty cell
      } else {
        newRow.push(num); // Keep the number
      }
    }
    newBoard.push(newRow);
  }

  return newBoard; // Return the initial Sudoku board
}

export function isValidSudokuInput(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num && i !== row) {
      return false;
    }
  }

  // Check subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num && i !== row && j !== col) {
        return false;
      }
    }
  }

  return true;
}

export function completedSudoku(board: number[][]): boolean {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (board[row][col] === 0) return false;

      if (!isValidSudokuInput(board, row, col, board[row][col])) return false;
    }
  }

  return true;
}
