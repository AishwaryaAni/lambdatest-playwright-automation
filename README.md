# LambdaTest Playground – Playwright E2E

End-to-end tests for https://ecommerce-playground.lambdatest.io (OpenCart 4 demo store).

## Run

```bash
npm install
npx playwright install chromium
npm test                                  # all tests (headless)
npm run test:headed                       # watch them in a browser
npx playwright test tests/Checkout.js     # one area
npm run report                            # open the HTML report
```

## Structure

```
fixtures/index.js    Playwright `test` extended with page objects + a `customer` fixture
                     (registers a fresh, logged-in account and exposes { user, dashboardUrl })
pages/               Page objects (Home/Header, Register, Login, Account, Catalog, Cart, Checkout, Contact)
test-data/data.js    Users (unique e-mail per run), address, products, categories
tests/               One spec per area:
  Signup.js  Login.js  Account.js  Navigation.js  Search.js  Category.js  Product.js
  AddToCart.js  Cart.js  Wishlist.js  Compare.js  Checkout.js  ContactUs.js
```

## Notes about the site

- **Unique e-mails:** every test that needs an account registers a new `itachi+<timestamp>@yopmail.com`, because the shared demo site rejects duplicates.
- **Account pages need `customer_token`:** opening an account URL without it logs the customer out. Tests always navigate from the dashboard URL (`customer.dashboardUrl`).
- **Where messages appear:** success and error messages show in `#alert`. Compare and wish-list notifications show in `#notification-box-top`.

## Known site bugs (tests marked `test.fail`)

These tests pass while the bug exists. Once the site is fixed they start failing, as a signal to remove the `test.fail` marker.

| Area | Bug |
|---|---|
| Navigation | Footer "Gift Certificates" link returns a 404 page |
| Product | Submitting a review without a rating shows no validation errors (PHP warning breaks the JSON response) |
| Category | List / Grid view buttons don't change the layout |
| Wish list | "Remove" logs the customer out |
