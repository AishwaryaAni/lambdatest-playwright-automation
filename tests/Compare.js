// @ts-check
const { test, expect } = require('../fixtures');
const { products } = require('../test-data/data');

test.describe('Product comparison', () => {
  test('User can compare two products and remove one', async ({ productPage, comparePage }) => {
    for (const product of [products.iphone, products.canon]) {
      await productPage.open(product.id);
      await productPage.compareButton.click();
      await expect(productPage.toast).toContainText(`Success: You have added ${product.name} to your product comparison!`);
    }

    await comparePage.open();
    await expect(comparePage.heading).toHaveText('Product Comparison');
    await expect(comparePage.table).toContainText(products.iphone.name);
    await expect(comparePage.table).toContainText(products.canon.name);
    await expect(comparePage.table).toContainText('Apple');
    await expect(comparePage.table).toContainText('Canon');

    await comparePage.remove(products.iphone.id);
    await expect(comparePage.table).not.toContainText(products.iphone.name);
    await expect(comparePage.table).toContainText(products.canon.name);
  });

  test('Empty comparison shows a message', async ({ comparePage }) => {
    await comparePage.open();
    await expect(comparePage.content).toContainText('You have not chosen any products to compare.');
  });
});
