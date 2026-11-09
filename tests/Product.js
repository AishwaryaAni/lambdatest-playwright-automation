// @ts-check
const { test, expect } = require('../fixtures');
const { products } = require('../test-data/data');

const product = products.iphone;

test.describe('Product page', () => {
  test.beforeEach(async ({ productPage }) => {
    await productPage.open(product.id);
    await expect(productPage.heading).toHaveText(product.name);
  });

  test('Shows product details', async ({ productPage }) => {
    await expect(productPage.brand).toContainText('Apple');
    await expect(productPage.availability).toBeVisible();
    await expect(productPage.content.locator('.price-new').first()).toHaveText(/^\$\d+\.\d{2}$/);
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('Review requires name, text and rating', async ({ productPage }) => {
    // Known bug: without a rating the server prefixes its JSON with a PHP "Undefined array key rating"
    // warning, so the page can't parse the response and shows no validation messages at all.
    test.fail(true, 'Known bug: submitting a review without a rating shows no validation errors');
    await productPage.writeReview({ name: '', text: '' });
    await expect(productPage.reviewErrors.filter({ hasText: 'Review Name must be between 3 and 25 characters!' })).toBeVisible();
  });

  test('Review name must be long enough', async ({ productPage }) => {
    await productPage.writeReview({ name: 'It', text: 'Great phone, works exactly as described. Automated test review.', rating: 4 });
    await expect(productPage.reviewErrors.filter({ hasText: 'Review Name must be between 3 and 25 characters!' })).toBeVisible();
  });

  test('Review text must be long enough', async ({ productPage }) => {
    await productPage.writeReview({ name: 'Itachi', text: 'Too short', rating: 5 });
    await expect(productPage.reviewErrors.filter({ hasText: 'Review Text must be between 25 and 1000 characters!' })).toBeVisible();
  });

  test('User can submit a review for approval', async ({ productPage }) => {
    await productPage.writeReview({
      name: 'Itachi',
      text: 'Great phone, works exactly as described. Automated test review.',
      rating: 5,
    });
    await productPage.expectSuccess('Thank you for your review. It has been submitted to the webmaster for approval.');
  });
});
