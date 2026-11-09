// @ts-check
const { test, expect } = require('../fixtures');
const { categories } = require('../test-data/data');

const category = categories.desktops;

test.describe('Category listing', () => {
  test.beforeEach(async ({ categoryPage }) => {
    await categoryPage.open(category.path);
    await expect(categoryPage.heading).toHaveText(category.name);
  });

  test('Shows 10 products per page by default with pagination', async ({ categoryPage }) => {
    await expect(categoryPage.productCards).toHaveCount(10);
    await expect(categoryPage.resultsSummary).toContainText('Showing 1 to 10 of');
    await expect(categoryPage.pagination).toBeVisible();
  });

  test('Second page shows the next products', async ({ categoryPage }) => {
    await categoryPage.pagination.getByRole('link', { name: '2', exact: true }).click();

    await expect(categoryPage.resultsSummary).toContainText('Showing 11 to 20 of');
    await expect(categoryPage.productCards).toHaveCount(10);
  });

  test('Show 25 per page', async ({ categoryPage }) => {
    await categoryPage.showPerPage(25);
    await expect(categoryPage.productCards).toHaveCount(25);
  });

  test('Sort by price low to high', async ({ categoryPage }) => {
    await categoryPage.sortBy('Price (Low > High)');

    const prices = await categoryPage.prices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('Sort by price high to low', async ({ categoryPage }) => {
    await categoryPage.sortBy('Price (High > Low)');

    const prices = await categoryPage.prices();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('Sort by name A to Z', async ({ categoryPage }) => {
    await categoryPage.sortBy('Name (A - Z)');

    const names = (await categoryPage.productNames.allInnerTexts()).map((n) => n.toLowerCase());
    expect(names).toEqual([...names].sort());
  });

  test('Switch between list and grid view', async ({ categoryPage }) => {
    test.fail(true, 'Known bug: the List / Grid buttons do not change the product layout');
    // In list view each product takes a full row; in grid view the first two sit side by side
    const sameRow = async () => {
      const [a, b] = await Promise.all([categoryPage.productCards.nth(0).boundingBox(), categoryPage.productCards.nth(1).boundingBox()]);
      return Math.abs((a?.y ?? 0) - (b?.y ?? 0)) < 5;
    };

    await categoryPage.listViewButton.click();
    await expect.poll(sameRow).toBe(false);

    await categoryPage.gridViewButton.click();
    await expect.poll(sameRow).toBe(true);
  });

  test('Product card opens the product page', async ({ categoryPage, productPage }) => {
    const name = (await categoryPage.productNames.first().innerText()).trim();
    await categoryPage.productNames.first().click();

    await expect(productPage.heading).toHaveText(name);
  });
});
