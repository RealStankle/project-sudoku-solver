class SudokuSolver {
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

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
