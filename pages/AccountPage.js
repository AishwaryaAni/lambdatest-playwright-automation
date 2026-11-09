// @ts-check
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * My Account area. These pages require the `customer_token` URL parameter -
 * opening them without it logs the customer out - so navigation always
 * starts from the dashboard URL captured after login/registration.
 */
class AccountPage extends BasePage {
  constructor(page) {
    super(page);
    this.sidebar = page.locator('#column-right');
    this.submitButton = page.locator('#content').getByRole('button', { name: 'Continue' });
  }

  async openDashboard(dashboardUrl) {
    await this.page.goto(dashboardUrl);
    await expect(this.page.getByRole('heading', { name: 'My Account' }).first()).toBeVisible();
  }

  /** Clicks one of the dashboard links, e.g. "Edit your account information". */
  async openSection(dashboardUrl, linkName) {
    await this.openDashboard(dashboardUrl);
    await this.content.getByRole('link', { name: linkName }).click();
  }

  async editInformation({ firstName, lastName, email }) {
    if (firstName !== undefined) await this.page.locator('#input-firstname').fill(firstName);
    if (lastName !== undefined) await this.page.locator('#input-lastname').fill(lastName);
    if (email !== undefined) await this.page.locator('#input-email').fill(email);
    await this.submitButton.click();
  }

  async changePassword(password, confirm = password) {
    await this.page.locator('#input-password').fill(password);
    await this.page.locator('#input-confirm').fill(confirm);
    await this.submitButton.click();
  }

  async addAddress(user, address) {
    await this.content.getByRole('link', { name: 'New Address' }).click();
    await this.page.locator('#input-firstname').fill(user.firstName);
    await this.page.locator('#input-lastname').fill(user.lastName);
    await this.page.locator('#input-address-1').fill(address.address1);
    await this.page.locator('#input-city').fill(address.city);
    await this.page.locator('#input-postcode').fill(address.postcode);
    await this.page.locator('#input-country').selectOption({ label: address.country });
    await expect(this.page.locator('#input-zone option', { hasText: address.region })).toBeAttached();
    await this.page.locator('#input-zone').selectOption({ label: address.region });
    await this.submitButton.click();
  }

  async setNewsletter(subscribed) {
    await this.page.locator('#input-newsletter').setChecked(subscribed, { force: true });
    await this.submitButton.click();
  }

  async logout() {
    await this.sidebar.getByRole('link', { name: 'Logout' }).click();
  }
}

module.exports = { AccountPage };
