const { expect } = require('chai');
const { api } = require('./api.client');

describe('Path coverage: POST /login', () => {
  it('exercises the login path with README user Alice Johnson', async () => {
    const response = await api()
      .post('/login')
      .send({
        email: 'alice@example.com',
        password: 'password123'
      });

    expect(response.status).to.equal(200);
    expect(response.body.user).to.deep.include({
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com'
    });
    expect(response.body.token).to.be.a('string').that.is.not.empty;
  });
});
