export function createSudokuBoard(): number[][] {
  const board: number[][] = new Array(9)
    .fill(null)
    .map(() => new Array(9).fill(0));

  function isValid(
    board: number[][],
    row: number,
    col: number,
    num: number
  ): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }
    return true;
  }

  function solve(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const shuffledNums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of shuffledNums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  solve(board);

  let newBoard: number[][] = [];
  for (let row of board) {
    let newRow: number[] = [];
    for (let num of row) {
      newRow.push(Math.random() < 0.5 ? 0 : num);
    }
    newBoard.push(newRow);
  }

  return newBoard;
}

export function isValidSudoku(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false;
    if (board[i][col] === num && i !== row) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num && i !== row && j !== col) return false;
    }
  }
  return true;
}

export function completedSudoku(board: number[][]): boolean {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (board[row][col] === 0) return false;
      if (!isValidSudoku(board, row, col, board[row][col])) return false;
    }
  }
  return true;
}

export function initialNumber(grid: number[][], row: number, col: number) {
  return grid[row][col] !== 0;
}

export function timeFormatter(time: number) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
