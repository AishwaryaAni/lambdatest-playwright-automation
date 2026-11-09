// @ts-check
const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.rows = page.locator('#content table tbody tr').filter({ has: page.locator('input[name^="quantity"]') });
    this.totals = page.locator('#content table').last();
    this.emptyMessage = page.getByText('Your shopping cart is empty!');
    this.couponToggle = page.getByRole('button', { name: 'Use Coupon Code' });
    this.couponInput = page.locator('#input-coupon');
    this.applyCouponButton = page.getByRole('button', { name: 'Apply Coupon' });
    this.checkoutButton = this.content.getByRole('link', { name: 'Checkout' });
    this.continueShoppingButton = this.content.getByRole('link', { name: 'Continue Shopping' });
  }

  async open() {
    await this.page.goto('/index.php?route=checkout/cart');
  }

  row(productName) {
    return this.rows.filter({ hasText: productName });
  }

  async updateQuantity(productName, quantity) {
    const row = this.row(productName);
    await row.locator('input[name^="quantity"]').fill(String(quantity));
    await row.getByRole('button', { name: 'Update' }).click();
  }

  async remove(productName) {
    await this.row(productName).getByRole('link', { name: 'Remove' }).click();
  }

  async applyCoupon(code) {
    await this.couponToggle.click();
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }
}

module.exports = { CartPage };
