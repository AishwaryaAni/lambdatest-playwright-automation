// @ts-check
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = page.getByRole('textbox', { name: 'First Name*' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name*' });
    this.email = page.getByRole('textbox', { name: 'E-Mail*' });
    this.password = page.getByRole('textbox', { name: 'Password*' });
    this.agree = page.locator('input[name="agree"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.fieldErrors = page.locator('#content .invalid-feedback');
  }

  async open() {
    await this.page.goto('/index.php?route=account/register');
  }

  async fillForm(user, { agree = true } = {}) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    if (agree) await this.agree.check({ force: true });
  }

  async submit() {
    await this.continueButton.click();
  }

  /** Registers the user (which also logs them in) and waits for the success page. */
  async register(user) {
    await this.fillForm(user);
    await this.submit();
    await expect(this.page).toHaveURL(/route=account(%2F|\/)success/);
  }

  /** From the success page, go to My Account. Returns the dashboard URL (it carries the session token). */
  async continueToAccount() {
    await this.page.getByRole('link', { name: 'Continue' }).click();
    await expect(this.page).toHaveURL(/customer_token=/);
    return this.page.url();
  }
}

module.exports = { RegisterPage };
