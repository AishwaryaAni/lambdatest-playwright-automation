// @ts-check
const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/** Shared behaviour of product listings (category, search, specials). */
class ListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.productCards = page.locator('#content .product-thumb');
    this.productNames = this.productCards.locator('h4.title a');
    this.productPrices = this.productCards.locator('.price .price-new');
    this.sort = page.locator('#input-sort');
    this.limit = page.locator('#input-limit');
    this.listViewButton = page.locator('#button-list');
    this.gridViewButton = page.locator('#button-grid');
    this.pagination = page.locator('#content .pagination');
    this.resultsSummary = page.locator('#content').getByText(/^Showing \d+ to \d+ of \d+/);
  }

  async sortBy(label) {
    await Promise.all([this.page.waitForURL(/sort=/), this.sort.selectOption({ label })]);
  }

  async showPerPage(count) {
    await Promise.all([this.page.waitForURL(new RegExp(`limit=${count}`)), this.limit.selectOption({ label: String(count) })]);
  }

  async openProduct(name) {
    await this.productNames.filter({ hasText: name }).first().click();
  }

  async prices() {
    const texts = await this.productPrices.allInnerTexts();
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  }
}

class CategoryPage extends ListingPage {
  async open(path) {
    await this.page.goto(`/index.php?route=product/category&path=${path}`);
  }
}

class SearchPage extends ListingPage {
  constructor(page) {
    super(page);
    this.noResults = page.getByText('There is no product that matches the search criteria.');
  }

  async open(term) {
    await this.page.goto(`/index.php?route=product/search&search=${encodeURIComponent(term)}`);
  }
}

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.quantity = page.locator('#input-quantity');
    this.addToCartButton = page.locator('#button-cart');
    this.addToWishListButton = this.content.getByRole('button', { name: 'Add to Wish List' }).first();
    this.compareButton = this.content.getByRole('button', { name: 'Compare this Product' }).first();
    this.availability = this.content.getByText(/^Availability:/).first();
    this.brand = this.content.getByText(/^Brand:/).first();
    this.reviewsTab = page.locator('a[href="#tab-review"]');
    this.reviewName = page.locator('#input-author');
    this.reviewText = page.locator('#input-text');
    this.reviewButton = page.locator('#button-review');
    this.reviewErrors = page.locator('#form-review .invalid-feedback.d-block');
  }

  async open(productId) {
    await this.page.goto(`/index.php?route=product/product&product_id=${productId}`);
  }

  async addToCart(quantity = 1) {
    await this.quantity.fill(String(quantity));
    await this.addToCartButton.click();
  }

  async writeReview({ name, text, rating }) {
    await this.reviewsTab.click();
    await this.reviewName.fill(name);
    await this.reviewText.fill(text);
    if (rating) await this.page.locator(`#form-review input[name="rating"][value="${rating}"]`).check({ force: true });
    await this.reviewButton.click();
  }
}

class ComparePage extends BasePage {
  constructor(page) {
    super(page);
    this.table = page.locator('#content table').first();
  }

  async open() {
    await this.page.goto('/index.php?route=product/compare');
  }

  async remove(productId) {
    await this.content.locator(`a[href*="remove=${productId}"]`).click();
  }
}

class WishlistPage extends BasePage {
  constructor(page) {
    super(page);
    this.rows = page.locator('#content table tbody tr');
  }

  async removeFirst() {
    await this.rows.first().getByRole('link', { name: 'Remove' }).click();
  }
}

module.exports = { ListingPage, CategoryPage, SearchPage, ProductPage, ComparePage, WishlistPage, expect };
