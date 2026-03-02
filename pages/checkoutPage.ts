import { Page, Locator, expect } from '@playwright/test';
import { testData } from '../fixtures/testData';
export class CheckoutPage {
  constructor(private page: Page) {}

  // --- Login ---
  private username = '[data-test="username"]';
  private password = '[data-test="password"]';
  private loginBtn = '[data-test="login-button"]';

   async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }
  async login(user: string, pass: string) {
    await this.page.fill(this.username, user);
    await this.page.fill(this.password, pass);
    await this.page.click(this.loginBtn);

  }
 

  // --- Products ---
  private addToCartBackpack = '[data-test="add-to-cart-sauce-labs-backpack"]';
  private addToCartBike = '[data-test="add-to-cart-sauce-labs-bike-light"]';
  private cartBadge = '[data-test="shopping-cart-badge"]';

  async addProducts() {
    await this.page.click(this.addToCartBackpack);
    await this.page.click(this.addToCartBike);
  }

  async verifyCartCount(count: number) {
    await expect(this.page.locator(this.cartBadge)).toHaveText(`${count}`);
  }

  // --- Cart ---
  private cartLink = '[data-test="shopping-cart-link"]';
  private checkoutBtn = '[data-test="checkout"]';

  async openCart() {
    await this.page.click(this.cartLink);
  }

  // --- Cart verification ---
private cartItems = '.cart_item';
private itemName = '.inventory_item_name';
private itemPrice = '.inventory_item_price';

async verifyCartContents(expectedProducts: { name: string; price: number }[]) {
  // Verify number of items in cart
  await expect(this.page.locator(this.cartItems)).toHaveCount(expectedProducts.length);

  for (let i = 0; i < expectedProducts.length; i++) {
    const item = this.page.locator(this.cartItems).nth(i);

    // Verify product name
    await expect(item.locator(this.itemName)).toHaveText(expectedProducts[i].name);

    // Verify product price
    const priceText = await item.locator(this.itemPrice).textContent();
    const price = parseFloat(priceText!.replace('$', ''));

    expect(price).toBeCloseTo(expectedProducts[i].price, 2);
  }
}

  async checkout() {
    await this.page.click(this.checkoutBtn);
  }

  // --- Checkout Form ---
  private firstName = '[data-test="firstName"]';
  private lastName = '[data-test="lastName"]';
  private postalCode = '[data-test="postalCode"]';
  private continueBtn = '[data-test="continue"]';

  async fillCheckoutForm(first: string, last: string, postal: string) {
    await this.page.fill(this.firstName, first);
    await this.page.fill(this.lastName, last);
    await this.page.fill(this.postalCode, postal);
    await this.page.click(this.continueBtn);
  }

  // --- Overview ---
  
  private itemTotalLabel = '[data-test="subtotal-label"]';
  private taxLabel = '[data-test="tax-label"]';
  private totalLabel = '[data-test="total-label"]' ;
  private finishBtn = '[data-test="finish"]';

  async verifyTotals() {
    const itemTotalText = await this.page.locator(this.itemTotalLabel).textContent();
    const taxText = await this.page.locator(this.taxLabel).textContent();
    const totalText = await this.page.locator(this.totalLabel).textContent();

    const itemTotal = parseFloat(itemTotalText!.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText!.replace(/[^0-9.]/g, ''));
    const total = parseFloat(totalText!.replace(/[^0-9.]/g, ''));

    expect(itemTotal + tax).toBeCloseTo(total, 2);
  }

  async finishPurchase() {
    await this.page.click(this.finishBtn);
  }

  // --- Confirmation ---
  private completeHeader = '[data-test="complete-header"]';
  private backHomeBtn = '[data-test="back-to-products"]';

  async verifyConfirmation() {
    await expect(this.page.locator(this.completeHeader)).toHaveText(testData.messages.orderConfirmation);
    await expect(this.page.locator(this.backHomeBtn)).toBeVisible();
  }

  async backToProducts() {
    await this.page.click(this.backHomeBtn);
  }
}