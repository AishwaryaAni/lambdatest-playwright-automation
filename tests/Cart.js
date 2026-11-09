// @ts-check
const { test, expect } = require('../fixtures');
const { products } = require('../test-data/data');

const product = products.iphone;

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ productPage, cartPage }) => {
    await productPage.open(product.id);
    await productPage.addToCart();
    await productPage.expectSuccess('Success: You have added');
    await cartPage.open();
    await expect(cartPage.row(product.name)).toHaveCount(1);
  });

  test('Cart shows sub-total and total', async ({ cartPage }) => {
    await expect(cartPage.totals).toContainText('Sub-Total');
    await expect(cartPage.totals).toContainText('Total');
  });

  test('User can update the quantity', async ({ cartPage }) => {
    await cartPage.updateQuantity(product.name, 2);

    await cartPage.expectSuccess('Success: You have modified your shopping cart!');
    await expect(cartPage.row(product.name).locator('input[name^="quantity"]')).toHaveValue('2');
  });

  test('User can remove a product', async ({ cartPage }) => {
    await cartPage.remove(product.name);

    await expect(cartPage.emptyMessage).toBeVisible();
  });

  test('Invalid coupon is rejected', async ({ cartPage }) => {
    await cartPage.applyCoupon('INVALID123');

    await cartPage.expectWarning('Coupon is either invalid, expired or reached its usage limit!');
  });

  test('Checkout button opens checkout', async ({ page, cartPage }) => {
    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/route=checkout(%2F|\/)checkout/);
  });

  test('Continue Shopping returns to the store', async ({ page, cartPage }) => {
    await cartPage.continueShoppingButton.click();
    await expect(page).not.toHaveURL(/route=checkout/);
  });
});

test('Empty cart shows a message', async ({ cartPage }) => {
  await cartPage.open();
  await expect(cartPage.emptyMessage).toBeVisible();
});
