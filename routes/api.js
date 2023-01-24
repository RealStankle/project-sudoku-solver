'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const puzzleValidation = solver.validate(puzzle);

    if (!puzzleValidation.result) {
      return res.json({ error: puzzleValidation.message });
    }

    if (!/^[A-I]{1}[1-9]{1}$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]{1}$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const rowValidation = solver.checkRowPlacement(
      puzzle,
      coordinate[0],
      coordinate[1],
      value
    );

    const colValidation = solver.checkColPlacement(
      puzzle,
      coordinate[0],
      coordinate[1],
      value
    );

    const regionValidation = solver.checkRegionPlacement(
      puzzle,
      coordinate[0],
      coordinate[1],
      value
    );

    if (
      !rowValidation.result ||
      !colValidation.result ||
      !regionValidation.result
    ) {
      const conflicts = [
        rowValidation.conflict,
        colValidation.conflict,
        regionValidation.conflict,
      ];

      return res.json({
        valid: false,
        conflict: conflicts.filter((item) => item),
      });
    }

    res.json({ valid: true });
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    const validation = solver.validate(puzzle);

    if (!validation.result) {
      return res.json({ error: validation.message });
    }

    const solvedPuzzle = solver.solve(puzzle);

    if (solvedPuzzle === null) {
      return res.json({ error: 'Puzzle cannot be solved' });
    }

    res.json({ solution: solvedPuzzle });
  });
};
