// @ts-check
const { test, expect } = require('../fixtures');
const { newUser, address, products } = require('../test-data/data');

const product = products.iphone;

test.describe('Checkout', () => {
  test('Logged-in user can place an order with Cash On Delivery', async ({ customer, page, productPage, checkoutPage, accountPage }) => {
    await productPage.open(product.id);
    await productPage.addToCart();
    await productPage.expectSuccess('Success: You have added');

    await checkoutPage.open();
    await checkoutPage.saveShippingAddress(customer.user, address);
    await checkoutPage.chooseFlatRateShipping();
    await checkoutPage.chooseCashOnDelivery();

    await expect(checkoutPage.summary).toContainText(product.name);
    await expect(checkoutPage.summary).toContainText('Flat Shipping Rate');
    await checkoutPage.confirmOrder();
    await expect(checkoutPage.heading).toContainText('Your order has been placed!');

    // The order shows up in the customer's order history
    await accountPage.openSection(customer.dashboardUrl, 'View your order history');
    await expect(page.locator('#content table tbody tr')).toHaveCount(1);
  });

  test('Guest can place an order', async ({ productPage, checkoutPage }) => {
    await productPage.open(product.id);
    await productPage.addToCart();
    await productPage.expectSuccess('Success: You have added');

    await checkoutPage.open();
    await checkoutPage.saveGuestDetails(newUser(), address);
    await checkoutPage.chooseFlatRateShipping();
    await checkoutPage.chooseCashOnDelivery();

    await expect(checkoutPage.summary).toContainText(product.name);
    await checkoutPage.confirmOrder();
    await expect(checkoutPage.heading).toContainText('Your order has been placed!');
  });

  test('Guest details are validated', async ({ productPage, checkoutPage }) => {
    await productPage.open(product.id);
    await productPage.addToCart();
    await productPage.expectSuccess('Success: You have added');

    await checkoutPage.open();
    await checkoutPage.selectGuestCheckout();
    await checkoutPage.guestContinueButton.click();

    for (const message of [
      'First Name must be between 1 and 32 characters!',
      'Last Name must be between 1 and 32 characters!',
      'E-Mail address does not appear to be valid!',
      'Address 1 must be between 3 and 128 characters!',
      'City must be between 2 and 128 characters!',
      'Please select a region / state!',
    ]) {
      await expect(checkoutPage.fieldErrors.filter({ hasText: message })).toBeVisible();
    }
  });

  test('Checkout with an empty cart redirects to the cart', async ({ page, checkoutPage, cartPage }) => {
    await checkoutPage.open();
    await expect(page).toHaveURL(/route=checkout(%2F|\/)cart/);
    await expect(cartPage.emptyMessage).toBeVisible();
  });
});
