// @ts-check
const { test, expect } = require('../fixtures');
const { products } = require('../test-data/data');

const product = products.iphone;

test.describe('Wish list', () => {
  test('Guest is asked to log in', async ({ productPage }) => {
    await productPage.open(product.id);
    await productPage.addToWishListButton.click();

    await expect(productPage.alert).toContainText(`You must login or create an account to save ${product.name} to your wish list!`);
  });

  test('Logged-in user can add a product', async ({ customer, productPage, accountPage, wishlistPage }) => {
    await productPage.open(product.id);
    await productPage.addToWishListButton.click();
    await expect(productPage.toast).toContainText(`Success: You have added ${product.name} to your wish list!`);

    await accountPage.openSection(customer.dashboardUrl, 'Modify your wish list');
    await expect(wishlistPage.rows).toHaveCount(1);
    await expect(wishlistPage.rows.first()).toContainText(product.name);
  });

  test('Logged-in user can remove a product', async ({ customer, page, productPage, accountPage, wishlistPage }) => {
    test.fail(true, 'Known bug: the wish list "Remove" button logs the customer out');

    await productPage.open(product.id);
    await productPage.addToWishListButton.click();
    await expect(productPage.toast).toContainText(product.name);

    await accountPage.openSection(customer.dashboardUrl, 'Modify your wish list');
    await wishlistPage.removeFirst();

    await expect(page.getByText('Your wish list is empty.')).toBeVisible();
  });
});
