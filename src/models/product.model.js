const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 1000
  },
  {
    id: 2,
    name: 'Headphones',
    price: 200
  },
  {
    id: 3,
    name: 'Wireless Mouse',
    price: 50
  }
];

function findAll() {
  return products;
}

function findById(id) {
  return products.find((product) => product.id === Number(id));
}

module.exports = {
  findAll,
  findById
};
