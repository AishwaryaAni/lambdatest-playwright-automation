// @ts-check
const base = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage, ForgottenPasswordPage } = require('../pages/LoginPage');
const { AccountPage } = require('../pages/AccountPage');
const { CategoryPage, SearchPage, ProductPage, ComparePage, WishlistPage } = require('../pages/CatalogPages');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { ContactPage } = require('../pages/ContactPage');
const { newUser } = require('../test-data/data');

/**
 * Page objects are available as fixtures, e.g. `async ({ productPage, cartPage }) => ...`.
 * `customer` registers a brand-new account in the test's browser (so the test starts logged in)
 * and exposes `{ user, dashboardUrl }`.
 */
const test = base.test.extend({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  forgottenPasswordPage: async ({ page }, use) => use(new ForgottenPasswordPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  comparePage: async ({ page }, use) => use(new ComparePage(page)),
  wishlistPage: async ({ page }, use) => use(new WishlistPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),

  customer: async ({ registerPage }, use) => {
    const user = newUser();
    await registerPage.open();
    await registerPage.register(user);
    const dashboardUrl = await registerPage.continueToAccount();
    await use({ user, dashboardUrl });
  },
});

module.exports = { test, expect: base.expect };
