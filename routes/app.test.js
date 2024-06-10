const request = require('supertest');
const app = require('./app');

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 200 and serve index.html', async () => {
  const response = await request(app).get('/');

  expect(response.status).toBe(200);

  expect(response.text).toContain('<!DOCTYPE html>');
});