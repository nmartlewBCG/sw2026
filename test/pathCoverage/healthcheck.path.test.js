const { expect } = require('chai');
const { api } = require('./api.client');

describe('Path coverage: GET /healthcheck', () => {
  it('exercises the healthcheck path', async () => {
    const response = await api().get('/healthcheck');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('ok');
    expect(response.body.timestamp).to.be.a('string').that.is.not.empty;
  });
});
