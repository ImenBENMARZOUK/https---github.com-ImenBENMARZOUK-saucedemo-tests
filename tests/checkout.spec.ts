import { test } from '@playwright/test';
import { CheckoutPage } from '../pages/checkoutPage';
import { expect } from '@playwright/test';
import { testData } from '../fixtures/testData';

test('User can complete a full checkout successfully', async ({ page }) => {
  const checkout = new CheckoutPage(page);
  // Go to the login page
  await checkout.goto();

  // Fill in login credentials & Click the login button
  await checkout.login(
    testData.credentials.username,
    testData.credentials.password
);
  
  // Verify that the Products page is displayed
  await expect(page).toHaveURL(/inventory/);
  
  // Add two products to the cart
  await checkout.addProducts();

  // Verify the cart badge shows 2 items
  await checkout.verifyCartCount(testData.cart.expectedCount);

  // Open the cart
  await checkout.openCart();

  // Verify that the cart page is displayed
  await expect(page).toHaveURL(/cart/);

  // check that the contents, quantities and prices are correct.
  await checkout.verifyCartContents(testData.products);

 // Proceed to checkout
  await checkout.checkout();

  // Verify that the "checkout-step-one" page is displayed
  await expect(page).toHaveURL(/checkout-step-one/);
  
  //Fill in checkout information
  await checkout.fillCheckoutForm(
    testData.checkoutInfo.firstName,
    testData.checkoutInfo.lastName,
    testData.checkoutInfo.postalCode
  );

  // Verify that the "checkout-step-two" page is displayed
  await expect(page).toHaveURL(/checkout-step-two/);

  await checkout.verifyTotals();
  await checkout.finishPurchase();

  // Verify that the "checkout-complete" page is displayed
  await expect(page).toHaveURL(/checkout-complete/);
  
  await checkout.verifyConfirmation();
  await checkout.backToProducts();

  // Verify that the Products page is displayed
  await expect(page).toHaveURL(/inventory/);
  
  
});