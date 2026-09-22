const { expect } = require('chai');
const { api } = require('./api.client');

describe('Path coverage: POST /register', () => {
  it('exercises the register path with README user Dana Lee', async () => {
    const response = await api()
      .post('/register')
      .send({
        name: 'Dana Lee',
        email: 'dana@example.com',
        password: 'password123'
      });

    expect(response.status).to.equal(201);
    expect(response.body.user).to.include({
      name: 'Dana Lee',
      email: 'dana@example.com'
    });
    expect(response.body.user.id).to.be.a('number');
    expect(response.body.token).to.be.a('string').that.is.not.empty;
  });
});
