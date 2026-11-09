// @ts-check
const { test, expect } = require('../fixtures');
const { newUser } = require('../test-data/data');

test.describe('Sign up', () => {
  test('User can register a new account', async ({ page, homePage, registerPage }) => {
    const user = newUser();

    await homePage.open();
    await homePage.header.openAccountMenuItem('Register');
    await expect(page).toHaveURL(/route=account(%2F|\/)register/);

    await registerPage.register(user);
    await expect(page.getByRole('heading', { name: 'Your Account Has Been Created!' })).toBeVisible();

    await registerPage.continueToAccount();
    await expect(page.getByRole('heading', { name: 'My Account' }).first()).toBeVisible();
  });

  test('Required fields are validated', async ({ registerPage }) => {
    await registerPage.open();
    await registerPage.submit();

    await expect(registerPage.fieldErrors.filter({ hasText: 'First Name must be between 1 and 32 characters!' })).toBeVisible();
    await expect(registerPage.fieldErrors.filter({ hasText: 'Last Name must be between 1 and 32 characters!' })).toBeVisible();
    await expect(registerPage.fieldErrors.filter({ hasText: 'E-Mail Address does not appear to be valid!' })).toBeVisible();
    await expect(registerPage.fieldErrors.filter({ hasText: 'Password must be between 6 and 40 characters!' })).toBeVisible();
    await registerPage.expectWarning('You must agree to the Privacy Policy!');
  });

  test('Privacy Policy must be accepted', async ({ registerPage }) => {
    await registerPage.open();
    await registerPage.fillForm(newUser(), { agree: false });
    await registerPage.submit();

    await registerPage.expectWarning('You must agree to the Privacy Policy!');
  });

  test('An already registered e-mail is rejected', async ({ customer, page, registerPage, accountPage }) => {
    // `customer` registered (and logged in) - log out, then try the same e-mail again
    await accountPage.openDashboard(customer.dashboardUrl);
    await accountPage.logout();

    await registerPage.open();
    await registerPage.fillForm(customer.user);
    await registerPage.submit();

    await registerPage.expectWarning('E-Mail Address is already registered!');
    await expect(page).toHaveURL(/route=account(%2F|\/)register/);
  });
});
