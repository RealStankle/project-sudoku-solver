const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzleStrings = require('../controllers/puzzle-strings');
let solver = new Solver();

suite('Unit Tests', () => {
  test('it should return true for valid puzzle', () => {
    const validationResult = solver.validate(puzzleStrings[0][0]);

    assert.deepEqual(validationResult, { result: true });
  });

  test('it should return false and error message if puzzle is not provided', () => {
    const validationResult = solver.validate();

    assert.deepEqual(validationResult, {
      result: false,
      message: 'Required field missing',
    });
  });

  test('it should return false and error message if puzzle contains invalid characters', () => {
    const validationResult = solver.validate(
      `${puzzleStrings[0][0].slice(0, 78)}abc`
    );

    assert.deepEqual(validationResult, {
      result: false,
      message: 'Invalid characters in puzzle',
    });
  });

  test('it should return false and error message for wrong puzzle length', () => {
    const validationResult = solver.validate(puzzleStrings[0][0].slice(0, 70));

    assert.deepEqual(validationResult, {
      result: false,
      message: 'Expected puzzle to be 81 characters long',
    });
  });
});
