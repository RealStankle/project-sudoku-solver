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
    const validationResult = solver.checkRowPlacement(
      puzzleStrings[0][0],
      'D',
      7
    );

    assert.isTrue(validationResult);
  });

  test('checkRowPlacement function should return false for an invalid row placement', () => {
    const validationResult = solver.checkRowPlacement(
      puzzleStrings[0][0],
      'H',
      3
    );

    assert.isFalse(validationResult);
  });

  test('checkColPlacement function should return true for a valid col placement', () => {
    const validationResult = solver.checkColPlacement(
      puzzleStrings[0][0],
      5,
      3
    );

    assert.isTrue(validationResult);
  });

  test('checkColPlacement function should return false for an invalid col placement', () => {
    const validationResult = solver.checkColPlacement(
      puzzleStrings[0][0],
      6,
      9
    );

    assert.isFalse(validationResult);
  });

  test('checkRegionPlacement function should return true for a valid region placement', () => {
    const validationResult = solver.checkRegionPlacement(
      puzzleStrings[0][0],
      'I',
      8,
      2
    );

    assert.isTrue(validationResult);
  });

  test('checkRegionPlacement function should return false for an invalid region placement', () => {
    const validationResult = solver.checkRegionPlacement(
      puzzleStrings[0][0],
      'E',
      3,
      1
    );

    assert.isFalse(validationResult);
  });
});
