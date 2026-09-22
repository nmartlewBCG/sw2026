const { expect } = require('chai');
const { api } = require('./api.client');

describe('Path coverage: POST /checkout', () => {
  it('exercises the checkout path with README cash cart for Alice Johnson', async () => {
    const login = await api()
      .post('/login')
      .send({
        email: 'alice@example.com',
        password: 'password123'
      });

    const response = await api()
      .post('/checkout')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        paymentMethod: 'cash',
        items: [
          { productId: 1, quantity: 1 },
          { productId: 3, quantity: 2 }
        ]
      });

    expect(response.status).to.equal(200);
    expect(response.body.user).to.deep.include({
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com'
    });
    expect(response.body.paymentMethod).to.equal('cash');
    expect(response.body.subtotal).to.equal(1100);
    expect(response.body.discountRate).to.equal(0.1);
    expect(response.body.discount).to.equal(110);
    expect(response.body.total).to.equal(990);
    expect(response.body.items).to.deep.equal([
      {
        productId: 1,
        name: 'Laptop',
        unitPrice: 1000,
        quantity: 1,
        lineTotal: 1000
      },
      {
        productId: 3,
        name: 'Wireless Mouse',
        unitPrice: 50,
        quantity: 2,
        lineTotal: 100
      }
    ]);
  });
});
