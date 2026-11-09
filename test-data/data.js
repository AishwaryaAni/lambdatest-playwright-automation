// @ts-check
/** Shared test data. */

/** Builds a user with a unique e-mail (the shared demo site rejects duplicates). */
function newUser(overrides = {}) {
  return {
    firstName: 'Itachi',
    lastName: 'Uchiha',
    email: `itachi+${Date.now()}${Math.floor(Math.random() * 100000)}@yopmail.com`,
    password: 'itachi@123',
    ...overrides,
  };
}

const address = {
  address1: '1 Akatsuki Lane',
  city: 'Konoha',
  postcode: '10001',
  country: 'United States',
  region: 'New York',
};

const products = {
  iphone: { id: 40, name: 'iPhone' },
  // Canon EOS 5D has a required "Size" option, so it can't be added to the cart without picking one
  canon: { id: 30, name: 'Canon EOS 5D' },
  htc: { id: 28, name: 'HTC Touch HD' },
};

const categories = {
  desktops: { path: 20, name: 'Desktops' },
};

module.exports = { newUser, address, products, categories };
