// @ts-check
const { test, expect } = require('../fixtures');
const { products } = require('../test-data/data');

test.describe('Search', () => {
  test('Search returns matching products', async ({ homePage, searchPage }) => {
    await homePage.open();
    await homePage.header.search('iPhone');

    await expect(searchPage.heading).toContainText('iPhone');
    await expect(searchPage.productNames.first()).toBeVisible();
    for (const name of await searchPage.productNames.allInnerTexts()) {
      expect(name.toLowerCase()).toContain('iphone');
    }
  });

  test('Search is case-insensitive', async ({ searchPage }) => {
    await searchPage.open('IPHONE');
    await expect(searchPage.productNames.filter({ hasText: products.iphone.name }).first()).toBeVisible();
  });

  test('Search with no match shows a message', async ({ searchPage }) => {
    await searchPage.open('zzzqqq-no-such-product');

    await expect(searchPage.noResults).toBeVisible();
    await expect(searchPage.productCards).toHaveCount(0);
  });

  test('Search result opens the product page', async ({ searchPage, productPage }) => {
    await searchPage.open(products.canon.name);
    await searchPage.openProduct(products.canon.name);

    await expect(productPage.heading).toHaveText(products.canon.name);
  });
});
