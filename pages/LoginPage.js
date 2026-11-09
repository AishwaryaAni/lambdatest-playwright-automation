// @ts-check
const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.email = page.getByRole('textbox', { name: 'E-Mail Address' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.forgottenLink = page.locator('#content').getByRole('link', { name: 'Forgotten Password' });
  }

  async open() {
    await this.page.goto('/index.php?route=account/login');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

class ForgottenPasswordPage extends BasePage {
  constructor(page) {
    super(page);
    this.email = page.getByRole('textbox', { name: 'E-Mail Address' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async open() {
    await this.page.goto('/index.php?route=account/forgotten');
  }

  async requestReset(email) {
    await this.email.fill(email);
    await this.continueButton.click();
  }
}

module.exports = { LoginPage, ForgottenPasswordPage };
