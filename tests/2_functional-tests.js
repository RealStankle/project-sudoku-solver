const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleStrings = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('POST /api/check, it correctly handles request containing all fields', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleStrings[0][0], coordinate: 'D7', value: 5 })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, { valid: true });
        done();
      });
  });

  test('POST /api/check, it correctly handles request with single placement conflict', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleStrings[0][0], coordinate: 'D4', value: 8 })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.isFalse(response.body.valid);
        assert.isArray(response.body.conflict);
        assert.lengthOf(response.body.conflict, 1);
        assert.sameMembers(response.body.conflict, ['row']);
        done();
      });
  });

  test('POST /api/check, it correctly handles request with multiple placement conflicts', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleStrings[0][0], coordinate: 'G5', value: 4 })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.isFalse(response.body.valid);
        assert.isArray(response.body.conflict);
        assert.lengthOf(response.body.conflict, 2);
        assert.sameMembers(response.body.conflict, ['row', 'region']);
        done();
      });
  });

  test('POST /api/check, it correctly handles request with all placement conflicts', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleStrings[0][0], coordinate: 'E1', value: 6 })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.isFalse(response.body.valid);
        assert.isArray(response.body.conflict);
        assert.lengthOf(response.body.conflict, 3);
        assert.sameMembers(response.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

  test('POST /api/check, it correctly handles request with missing required fields', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ coordinate: 'D7', value: 5 })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('POST /api/check, it correctly handles request with invalid characters', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: `${puzzleStrings[0][0].slice(0, 78)}abc`,
        coordinate: 'D7',
        value: 5,
      })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, {
          error: 'Invalid characters in puzzle',
        });
        done();
      });
  });

  test('POST /api/check, it correctly handles request with incorrect length', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleStrings[0][0].slice(0, 70),
        coordinate: 'D7',
        value: 5,
      })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, {
          error: 'Expected puzzle to be 81 characters long',
        });
        done();
      });
  });

  test('POST /api/check, it correctly handles request with invalid placement coordinate', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleStrings[0][0], coordinate: 'K24', value: 5 })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  test('POST /api/check, it correctly handles request with invalid placement value', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({ puzzle: puzzleStrings[0][0], coordinate: 'D7', value: 28 })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, { error: 'Invalid value' });
        done();
      });
  });

  test('POST /api/solve, it correctly handles the request with a valid puzzle string', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleStrings[2][0] })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.solution, puzzleStrings[2][1]);
        done();
      });
  });

  test('POST /api/solve, it correctly handles the request with the missing puzzle string', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, { error: 'Required field missing' });
        done();
      });
  });

  test('POST /api/solve, it correctly handles the request with the puzzle containing invalid characters', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: `${puzzleStrings[2][0].slice(0, 70)}abcde123456` })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, {
          error: 'Invalid characters in puzzle',
        });
        done();
      });
  });

  test('POST /api/solve, it correctly handles the request with the incorrect length puzzle', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: `${puzzleStrings[2][0].slice(0, 60)}` })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, {
          error: 'Expected puzzle to be 81 characters long',
        });
        done();
      });
  });

  test('POST /api/solve, it correctly handles the request with the puzzle that cannot be solved', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: `${puzzleStrings[2][0].slice(0, 75)}167843` })
      .end((_, response) => {
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });
});
