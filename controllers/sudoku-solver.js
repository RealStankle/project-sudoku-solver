class SudokuSolver {
  constructor() {
    this.rowsMap = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
    };
  }

  validate(puzzleString) {
    if (!puzzleString) {
      return { result: false, message: 'Required field missing' };
    }

    if (puzzleString.length !== 81) {
      return {
        result: false,
        message: 'Expected puzzle to be 81 characters long',
      };
    }

    const validationRegex = /^(\d|\.)+$/;

    if (!validationRegex.test(puzzleString)) {
      return { result: false, message: 'Invalid characters in puzzle' };
    }

    return { result: true };
  }

  checkExistance(puzzleString, row, column) {
    const cellIndex = this.rowsMap[row] * 9 + (column - 1);

    if (puzzleString[cellIndex] !== '.') {
      return `${puzzleString.slice(0, cellIndex)}.${puzzleString.slice(
        cellIndex + 1
      )}`;
    }

    return puzzleString;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    puzzleString = this.checkExistance(puzzleString, row, column);

    const startIndex = this.rowsMap[row] * 9;
    const endIndex = startIndex + 9;

    const rowString = puzzleString.slice(startIndex, endIndex);

    if (rowString.includes(value.toString())) {
      return { result: false, conflict: 'row' };
    }

    return { result: true };
  }

  checkColPlacement(puzzleString, row, column, value) {
    puzzleString = this.checkExistance(puzzleString, row, column);

    const columnArray = [];

    for (let i = 0; i < 9; i++) {
      columnArray.push(puzzleString[i * 9 + (column - 1)]);
    }

    if (columnArray.includes(value.toString())) {
      return { result: false, conflict: 'column' };
    }

    return { result: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    puzzleString = this.checkExistance(puzzleString, row, column);

    const rowIndexOfRegion = Math.floor(this.rowsMap[row] / 3);
    const columnIndexOfRegion = Math.floor((column - 1) / 3);

    const IndexOfFirstElement = 27 * rowIndexOfRegion + 3 * columnIndexOfRegion;

    const regionArray = [];

    // it takes one row of the region on each iteration
    for (let i = 0; i < 3; i++) {
      // it takes one element of the row at each iteration
      for (let j = 0; j < 3; j++) {
        regionArray.push(puzzleString[IndexOfFirstElement + j + 9 * i]);
      }
    }

    if (regionArray.includes(value.toString())) {
      return { result: false, conflict: 'region' };
    }

    return { result: true };
  }

  solve(puzzleString) {
    const hasEmptyCells = /\./.test(puzzleString);

    if (!hasEmptyCells) {
      return puzzleString;
    }

    for (let row = 0; row < 9; row++) {
      const rowString = String.fromCharCode(65 + row);
      for (let col = 0; col < 9; col++) {
        const colNumber = col + 1;
        const cellIndex = 9 * row + col;

        if (puzzleString[cellIndex] !== '.') {
          continue;
        }

        for (let guess = 1; guess < 10; guess++) {
          const rowValidation = this.checkRowPlacement(
            puzzleString,
            rowString,
            colNumber,
            guess
          );
          const colValidation = this.checkColPlacement(
            puzzleString,
            rowString,
            colNumber,
            guess
          );
          const regionValidation = this.checkRegionPlacement(
            puzzleString,
            rowString,
            colNumber,
            guess
          );

          if (
            !rowValidation.result ||
            !colValidation.result ||
            !regionValidation.result
          ) {
            continue;
          }

          const solvedPuzzleString = this.solve(
            puzzleString.replace(/\./, guess.toString())
          );

          if (solvedPuzzleString) {
            return solvedPuzzleString;
          }
        }

        return null;
      }
    }
  }
}

module.exports = SudokuSolver;
