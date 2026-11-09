// @ts-check
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.guestRadio = page.locator('#input-guest');
    this.guestContinueButton = page.locator('#button-register');
    this.shippingMethod = page.locator('#input-shipping-method');
    this.paymentMethod = page.locator('#input-payment-method');
    this.summary = page.locator('#checkout-confirm');
    this.confirmButton = page.getByRole('button', { name: 'Confirm Order' });
    this.fieldErrors = page.locator('#content .invalid-feedback.d-block');
  }

  async open() {
    // Wait for the AJAX-loaded form parts (custom fields). Submitting the guest form before they
    // arrive makes the server fail with "Array callback must have exactly two elements".
    await this.page.goto('/index.php?route=checkout/checkout', { waitUntil: 'networkidle' });
  }

  async fillShippingAddress(address, { firstName, lastName } = {}) {
    if (firstName) await this.page.locator('#input-shipping-firstname').fill(firstName);
    if (lastName) await this.page.locator('#input-shipping-lastname').fill(lastName);
    await this.page.locator('#input-shipping-address-1').fill(address.address1);
    await this.page.locator('#input-shipping-city').fill(address.city);
    await this.page.locator('#input-shipping-postcode').fill(address.postcode);
    await this.page.locator('#input-shipping-country').selectOption({ label: address.country });
    // Regions load via AJAX after the country is picked
    await expect(this.page.locator('#input-shipping-zone option', { hasText: address.region })).toBeAttached();
    await this.page.locator('#input-shipping-zone').selectOption({ label: address.region });
  }

  /** Logged-in customer: new shipping address. */
  async saveShippingAddress(user, address) {
    await this.fillShippingAddress(address, user);
    await this.page.locator('#button-shipping-address').click();
    await this.expectSuccess('Success');
  }

  /** Guest checkout: personal details + shipping address. */
  async selectGuestCheckout() {
    await this.guestRadio.check();
    // Switching to guest hides the account password field
    await expect(this.page.locator('#input-password')).toBeHidden();
  }

  async saveGuestDetails(user, address) {
    await this.selectGuestCheckout();
    await this.page.locator('#input-firstname').fill(user.firstName);
    await this.page.locator('#input-lastname').fill(user.lastName);
    await this.page.locator('#input-email').fill(user.email);
    await this.fillShippingAddress(address);
    await this.guestContinueButton.click();
    await this.expectSuccess('Your guest account information has been saved');
  }

  async chooseFlatRateShipping() {
    await this.page.locator('#button-shipping-methods').click();
    await this.page.locator('#input-shipping-method-flat-flat').check();
    await this.page.locator('#button-shipping-method').click();
    await expect(this.shippingMethod).toHaveValue(/Flat Shipping Rate/);
  }

  async chooseCashOnDelivery() {
    await this.page.locator('#button-payment-methods').click();
    await this.page.locator('#input-payment-method-cod-cod').check();
    await this.page.locator('#button-payment-method').click();
    await expect(this.paymentMethod).toHaveValue('Cash On Delivery');
  }

  async confirmOrder() {
    await this.confirmButton.click();
    await expect(this.page).toHaveURL(/route=checkout(%2F|\/)success/);
  }
}

module.exports = { CheckoutPage };
