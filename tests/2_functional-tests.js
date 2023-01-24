const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleStrings = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/check', () => {
    test('it correctly handles request containing all fields', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'D7', value: 5 });

      assert.strictEqual(response.status, 200);
      assert.deepEqual(response.body, { valid: true });
    });

    test('it correctly handles request with single placement conflict', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'D4', value: 8 });

      assert.strictEqual(response.status, 200);
      assert.isFalse(response.body.valid);
      assert.isArray(response.body.conflict);
      assert.lengthOf(response.body.conflict, 1);
      assert.sameMembers(response.body.conflict, ['row']);
    });

    test('it correctly handles request with multiple placement conflicts', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'G5', value: 4 });

      assert.strictEqual(response.status, 200);
      assert.isFalse(response.body.valid);
      assert.isArray(response.body.conflict);
      assert.lengthOf(response.body.conflict, 2);
      assert.sameMembers(response.body.conflict, ['row', 'region']);
    });

    test('it correctly handles request with all placement conflicts', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'E1', value: 6 });

      assert.strictEqual(response.status, 200);
      assert.isFalse(response.body.valid);
      assert.isArray(response.body.conflict);
      assert.lengthOf(response.body.conflict, 3);
      assert.sameMembers(response.body.conflict, ['row', 'column', 'region']);
    });

    test('it correctly handles request with missing required fields', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({ coordinate: 'D7', value: 5 });

      assert.strictEqual(response.status, 200);
      assert.deepEqual(response.body, { error: 'Required field(s) missing' });
    });

    test('it correctly handles request with invalid characters', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: `${puzzleStrings[0][0].slice(0, 78)}abc`,
          coordinate: 'D7',
          value: 5,
        });

      assert.strictEqual(response.status, 200);
      assert.deepEqual(response.body, {
        error: 'Invalid characters in puzzle',
      });
    });

    test('it correctly handles request with incorrect length', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStrings[0][0].slice(0, 70),
          coordinate: 'D7',
          value: 5,
        });

      assert.strictEqual(response.status, 200);
      assert.deepEqual(response.body, {
        error: 'Expected puzzle to be 81 characters long',
      });
    });

    test('it correctly handles request with invalid placement coordinate', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'K24', value: 5 });

      assert.strictEqual(response.status, 200);
      assert.deepEqual(response.body, { error: 'Invalid coordinate' });
    });

    test('it correctly handles request with invalid placement value', async () => {
      const response = await chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzleStrings[0][0], coordinate: 'D7', value: 28 });

      assert.strictEqual(response.status, 200);
      assert.deepEqual(response.body, { error: 'Invalid value' });
    });
  });
});
