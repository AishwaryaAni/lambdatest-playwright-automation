// @ts-check
const { test, expect } = require('../fixtures');
const { newUser } = require('../test-data/data');
const { RegisterPage } = require('../pages/RegisterPage');

const user = newUser();

test.describe('Login', () => {
  // Create one account, in its own browser context, so each login test starts logged out.
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const registerPage = new RegisterPage(await context.newPage());
    await registerPage.open();
    await registerPage.register(user);
    await context.close();
  });

  test('User can log in with valid credentials', async ({ page, homePage, loginPage }) => {
    await homePage.open();
    await homePage.header.openAccountMenuItem('Login');
    await expect(page).toHaveURL(/route=account(%2F|\/)login/);

    await loginPage.login(user.email, user.password);

    await expect(page).toHaveURL(/route=account(%2F|\/)account/);
    await expect(page.getByRole('heading', { name: 'My Account' }).first()).toBeVisible();
  });

  test('User cannot log in with a wrong password', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(user.email, 'wrong-password');

    await loginPage.expectWarning('No match for E-Mail Address and/or Password');
    await expect(page).toHaveURL(/route=account(%2F|\/)login/);
  });

  test('User cannot log in with an unregistered e-mail', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(newUser().email, 'whatever123');

    await loginPage.expectWarning('No match for E-Mail Address and/or Password');
  });

  test('User can log out', async ({ page, loginPage, accountPage }) => {
    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await expect(page).toHaveURL(/customer_token=/);

    await accountPage.logout();
    await expect(page.getByRole('heading', { name: 'Account Logout' })).toBeVisible();
    await expect(page).toHaveURL(/route=account(%2F|\/)logout/);
  });

  test('Forgotten password rejects an unknown e-mail', async ({ loginPage, forgottenPasswordPage, page }) => {
    await loginPage.open();
    await loginPage.forgottenLink.click();
    await expect(page).toHaveURL(/route=account(%2F|\/)forgotten/);

    await forgottenPasswordPage.requestReset(newUser().email);
    await forgottenPasswordPage.expectWarning('The E-Mail Address was not found in our records!');
  });

  test('Forgotten password accepts a known e-mail', async ({ forgottenPasswordPage, page }) => {
    await forgottenPasswordPage.open();
    await forgottenPasswordPage.requestReset(user.email);

    // The site sends the reset mail and redirects to the login page (no on-screen confirmation)
    await expect(page).toHaveURL(/route=account(%2F|\/)login/);
    await expect(forgottenPasswordPage.alert.locator('.alert-danger')).toHaveCount(0);
  });
});
