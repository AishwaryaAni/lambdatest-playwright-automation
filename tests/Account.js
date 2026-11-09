// @ts-check
const { test, expect } = require('../fixtures');
const { address } = require('../test-data/data');

test.describe('My Account', () => {
  test('Dashboard lists all account sections', async ({ customer, accountPage }) => {
    await accountPage.openDashboard(customer.dashboardUrl);

    for (const link of [
      'Edit your account information',
      'Change your password',
      'Modify your address book entries',
      'Modify your wish list',
      'Subscribe / unsubscribe to newsletter',
      'View your order history',
    ]) {
      await expect(accountPage.content.getByRole('link', { name: link })).toBeVisible();
    }
  });

  test('User can edit account information', async ({ customer, accountPage, page }) => {
    await accountPage.openSection(customer.dashboardUrl, 'Edit your account information');
    await expect(accountPage.heading).toHaveText('My Account Information');

    await accountPage.editInformation({ firstName: 'Sasuke' });
    await accountPage.expectSuccess('Your account has been successfully updated.');

    await page.reload();
    await expect(page.locator('#input-firstname')).toHaveValue('Sasuke');
  });

  test('User can change password and log in with it', async ({ customer, accountPage, loginPage, page }) => {
    const newPassword = 'sasuke@123';

    await accountPage.openSection(customer.dashboardUrl, 'Change your password');
    await accountPage.changePassword(newPassword);
    await accountPage.expectSuccess('Your password has been successfully updated.');

    await accountPage.openDashboard(customer.dashboardUrl);
    await accountPage.logout();
    await loginPage.open();
    await loginPage.login(customer.user.email, newPassword);
    await expect(page).toHaveURL(/route=account(%2F|\/)account/);
  });

  test('Password confirmation must match', async ({ customer, accountPage, page }) => {
    await accountPage.openSection(customer.dashboardUrl, 'Change your password');
    await accountPage.changePassword('sasuke@123', 'different@123');

    await expect(page.locator('#content .invalid-feedback').filter({ hasText: 'Password confirmation does not match password!' })).toBeVisible();
  });

  test('User can add an address', async ({ customer, accountPage }) => {
    await accountPage.openSection(customer.dashboardUrl, 'Modify your address book entries');
    await expect(accountPage.content).toContainText('You have no addresses in your account.');

    await accountPage.addAddress(customer.user, address);

    await expect(accountPage.content).toContainText(address.address1);
    await expect(accountPage.content).toContainText(`${address.city}, ${address.region} ${address.postcode}`);
  });

  test('User can subscribe to the newsletter', async ({ customer, accountPage, page }) => {
    await accountPage.openSection(customer.dashboardUrl, 'Subscribe / unsubscribe to newsletter');
    await accountPage.setNewsletter(true);

    await accountPage.expectSuccess('Your newsletter subscription has been successfully updated!');
    await page.reload();
    await expect(page.locator('#input-newsletter')).toBeChecked();
  });

  test('New customer has no orders', async ({ customer, accountPage }) => {
    await accountPage.openSection(customer.dashboardUrl, 'View your order history');
    await expect(accountPage.content).toContainText('You have not made any previous orders!');
  });

  test('Account pages require login', async ({ page }) => {
    await page.goto('/index.php?route=account/edit');
    await expect(page).toHaveURL(/route=account(%2F|\/)login/);
  });
});
