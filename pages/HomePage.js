// @ts-check
const { BasePage } = require('./BasePage');
const { HeaderComponent } = require('./HeaderComponent');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.footer = page.locator('footer');
  }

  async open() {
    await this.page.goto('/');
  }
}

module.exports = { HomePage };
