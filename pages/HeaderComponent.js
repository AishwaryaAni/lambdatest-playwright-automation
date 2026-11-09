// @ts-check

class HeaderComponent {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: 'Search For Products' }).first();
    this.searchButton = page.getByRole('button', { name: 'Search' }).first();
    this.myAccountMenu = page.getByRole('link', { name: 'My account' }).first();
    this.topMenu = page.locator('#widget-navbar-217834');
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /** "Login" / "Register" live in the My account hover menu. */
  async openAccountMenuItem(name) {
    await this.myAccountMenu.hover();
    await this.page.getByRole('link', { name, exact: true }).first().click();
  }

  async clickTopMenu(name) {
    await this.page.locator('header').getByRole('link', { name }).first().click();
  }
}

module.exports = { HeaderComponent };
