// @ts-check
const { test, expect } = require('../fixtures');
const { products } = require('../test-data/data');

test.describe('Add to cart', () => {
  test('User can add a product to the cart from search results', async ({ page, homePage, searchPage, productPage, cartPage }) => {
    const product = products.iphone.name;

    await homePage.open();
    await homePage.header.search(product);
    await expect(page).toHaveURL(/route=product(%2F|\/)search/);

    await searchPage.openProduct(product);
    await expect(productPage.heading).toHaveText(product);

    await productPage.addToCart();
    // The success toast fades out after a few seconds, so assert on it right away
    await productPage.expectSuccess(`Success: You have added ${product}`);

    await cartPage.open();
    await expect(cartPage.row(product)).toHaveCount(1);
    await expect(cartPage.row(product).locator('input[name^="quantity"]')).toHaveValue('1');
  });

  test('User can add several units at once', async ({ productPage, cartPage }) => {
    await productPage.open(products.iphone.id);
    await productPage.addToCart(3);
    await productPage.expectSuccess('Success: You have added');

    await cartPage.open();
    await expect(cartPage.row(products.iphone.name).locator('input[name^="quantity"]')).toHaveValue('3');
  });

  test('User can add different products to the cart', async ({ productPage, cartPage }) => {
    for (const product of [products.iphone, products.htc]) {
      await productPage.open(product.id);
      await productPage.addToCart();
      await productPage.expectSuccess(`Success: You have added ${product.name}`);
    }

    await cartPage.open();
    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.row(products.iphone.name)).toHaveCount(1);
    await expect(cartPage.row(products.htc.name)).toHaveCount(1);
  });
});
