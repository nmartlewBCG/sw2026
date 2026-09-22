const request = require('supertest');

function api() {
  const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:3001';
  return request(baseUrl);
}

module.exports = {
  api
};
