const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzleStrings = require('../controllers/puzzle-strings');
let solver = new Solver();

suite('Unit Tests', () => {
  test('validate function should return true for valid puzzle', () => {
    const validationResult = solver.validate(puzzleStrings[0][0]);

    assert.deepEqual(validationResult, { result: true });
  });

  test('validate function should return false and error message if puzzle is not provided', () => {
    const validationResult = solver.validate();

    assert.deepEqual(validationResult, {
      result: false,
      message: 'Required field missing',
    });
  });

  test('validate function should return false and error message if puzzle contains invalid characters', () => {
    const validationResult = solver.validate(
      `${puzzleStrings[0][0].slice(0, 78)}abc`
    );

    assert.deepEqual(validationResult, {
      result: false,
      message: 'Invalid characters in puzzle',
    });
  });

  test('validate function should return false and error message for wrong puzzle length', () => {
    const validationResult = solver.validate(puzzleStrings[0][0].slice(0, 70));

    assert.deepEqual(validationResult, {
      result: false,
      message: 'Expected puzzle to be 81 characters long',
    });
  });

  test('checkRowPlacement function should return true for a valid row placement', () => {
    const checkRowPlacementResult = solver.checkRowPlacement(
      puzzleStrings[0][0],
      'D',
      3,
      7
    );

    assert.isTrue(checkRowPlacementResult.result);
  });

  test('checkRowPlacement function should return false for an invalid row placement', () => {
    const checkRowPlacementResult = solver.checkRowPlacement(
      puzzleStrings[0][0],
      'H',
      2,
      3
    );

    assert.isFalse(checkRowPlacementResult.result);
    assert.strictEqual(checkRowPlacementResult.conflict, 'row');
  });

  test('checkColPlacement function should return true for a valid col placement', () => {
    const checkColPlacementResult = solver.checkColPlacement(
      puzzleStrings[0][0],
      'A',
      5,
      3
    );

    assert.isTrue(checkColPlacementResult.result);
  });

  test('checkColPlacement function should return false for an invalid col placement', () => {
    const checkColPlacementResult = solver.checkColPlacement(
      puzzleStrings[0][0],
      'I',
      6,
      9
    );

    assert.isFalse(checkColPlacementResult.result);
    assert.strictEqual(checkColPlacementResult.conflict, 'column');
  });

  test('checkRegionPlacement function should return true for a valid region placement', () => {
    const checkRegionPlacementResult = solver.checkRegionPlacement(
      puzzleStrings[0][0],
      'I',
      8,
      2
    );

    assert.isTrue(checkRegionPlacementResult.result);
  });

  test('checkRegionPlacement function should return false for an invalid region placement', () => {
    const checkRegionPlacementResult = solver.checkRegionPlacement(
      puzzleStrings[0][0],
      'E',
      3,
      1
    );

    assert.isFalse(checkRegionPlacementResult.result);
    assert.strictEqual(checkRegionPlacementResult.conflict, 'region');
  });

  test('solve function should pass for valid puzzle string', () => {
    const solveResult = solver.solve(puzzleStrings[0][0]);

    assert.isNotNull(solveResult);
  });

  test('solve function should fail for invalid puzzle string', () => {
    const solveResult = solver.solve(`${puzzleStrings[0][0].slice(0, 78)}123`);

    assert.isNull(solveResult);
  });

  test('solve function should return solved puzzle string for valid puzzle string', () => {
    const solvedPuzzleString = solver.solve(puzzleStrings[1][0]);

    assert.strictEqual(solvedPuzzleString, puzzleStrings[1][1]);
  });
});
