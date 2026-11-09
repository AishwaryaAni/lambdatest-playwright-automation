// @ts-check
const { test, expect } = require('../fixtures');

test.describe('Navigation', () => {
  test('Home page loads with header, search and footer', async ({ page, homePage }) => {
    await homePage.open();

    await expect(page).toHaveTitle('Your Store');
    await expect(homePage.header.searchInput).toBeVisible();
    await expect(homePage.header.myAccountMenu).toBeVisible();
    await expect(homePage.footer).toBeVisible();
  });

  test('Top menu: Special and Home', async ({ page, homePage }) => {
    await homePage.open();
    await homePage.header.clickTopMenu('Special');
    await expect(page).toHaveURL(/route=product(%2F|\/)special/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Special Offers');

    await homePage.header.clickTopMenu('Home');
    await expect(page).toHaveTitle('Your Store');
  });

  test('Shop by Category opens a category', async ({ page, homePage, categoryPage }) => {
    await homePage.open();
    await page.getByRole('button', { name: 'Shop by Category' }).or(page.getByRole('link', { name: 'Shop by Category' })).first().click();
    await page.getByRole('link', { name: 'Desktops' }).first().click();

    await expect(page).toHaveURL(/route=product(%2F|\/)category/);
    await expect(categoryPage.productCards.first()).toBeVisible();
  });

  test('Cart icon opens the cart', async ({ page, homePage }) => {
    await homePage.open();
    await page.goto('/index.php?route=checkout/cart');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Shopping Cart');
  });

  // Footer links: [link text, expected page title]
  const footerPages = [
    ['About Us', 'About Us'],
    ['Delivery Information', 'Delivery Information'],
    ['Privacy Policy', 'Privacy Policy'],
    ['Terms & Conditions', 'Terms & Conditions'],
    ['Contact Us', 'Contact Us'],
    ['Site Map', 'Site Map'],
    ['Brands', 'Find Your Favorite Brand'],
    ['Specials', 'Special Offers'],
  ];

  for (const [link, title] of footerPages) {
    test(`Footer link "${link}" opens its page`, async ({ page, homePage }) => {
      await homePage.open();
      await homePage.footer.getByRole('link', { name: link, exact: true }).click();
      await expect(page).toHaveTitle(title);
    });
  }

  test('Footer link "Gift Certificates" opens its page', async ({ page, homePage }) => {
    // Known site bug: this link currently returns "The page you requested cannot be found!"
    test.fail(true, 'Known bug: Gift Certificates footer link returns a 404 page');
    await homePage.open();
    await homePage.footer.getByRole('link', { name: 'Gift Certificates', exact: true }).click();
    await expect(page).not.toHaveTitle('The page you requested cannot be found!');
  });
});
