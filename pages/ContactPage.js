// @ts-check
const { BasePage } = require('./BasePage');

class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    this.name = page.locator('#input-name');
    this.email = page.locator('#input-email');
    this.enquiry = page.locator('#input-enquiry');
    this.submitButton = this.content.getByRole('button', { name: 'Submit' });
    this.fieldErrors = page.locator('#content .invalid-feedback.d-block, #content .text-danger');
  }

  async open() {
    await this.page.goto('/index.php?route=information/contact');
  }

  async send({ name, email, enquiry }) {
    await this.name.fill(name);
    await this.email.fill(email);
    await this.enquiry.fill(enquiry);
    await this.submitButton.click();
  }
}

module.exports = { ContactPage };
