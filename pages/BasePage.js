// @ts-check
const { expect } = require('@playwright/test');

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    /** Success / warning messages are rendered into this container (they fade out after a few seconds). */
    this.alert = page.locator('#alert');
    /** Compare / wish list notifications appear as a toast here. */
    this.toast = page.locator('#notification-box-top');
    this.heading = page.getByRole('heading', { level: 1 });
    this.content = page.locator('#content');
  }

  async expectSuccess(text) {
    await expect(this.alert.locator('.alert-success')).toContainText(text);
  }

  async expectWarning(text) {
    await expect(this.alert.locator('.alert-danger')).toContainText(text);
  }
}

module.exports = { BasePage };
