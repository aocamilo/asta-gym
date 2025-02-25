import { Page, expect } from "@playwright/test";

/**
 * Utility functions for testing different types of modals
 */

// Standard Modal
export async function testStandardModal(page: Page) {
  // Open the modal
  await page.click('button:text("Open Standard Modal")');

  // Check if modal is visible
  const modal = page.locator('[role="dialog"]').first();
  await expect(modal).toBeVisible();

  // Test form interaction
  await page.fill("#name", "Test User");
  await page.fill("#email", "test@example.com");
  await page.fill("#message", "Test message");

  // Close modal
  await page.click('button:text("Cancel")');
  await expect(modal).not.toBeVisible();
}

// Portal Modal
export async function testPortalModal(page: Page) {
  // Open the modal
  await page.click('button:text("Open Portal Modal")');

  // Check if modal is visible (should be at document.body level)
  const modal = page.locator('body > [role="dialog"]');
  await expect(modal).toBeVisible();

  // Test gallery interaction
  await page.click('button:text("Architecture")');
  await expect(page.locator('[role="tabpanel"]')).toBeVisible();

  // Close modal
  await page.click('button:text("Close Gallery")');
  await expect(modal).not.toBeVisible();
}

// Shadow DOM Modal
export async function testShadowDomModal(page: Page) {
  // Open the modal
  await page.click('button:text("Open Shadow DOM Modal")');

  // Access shadow root content
  const shadowHost = page.locator('div:has(> [mode="open"])');
  const shadowRoot = shadowHost.locator(">>> .modal-content");
  await expect(shadowRoot).toBeVisible();

  // Test confirmation interaction
  await page.click(">>> #confirm-btn");
  await expect(shadowRoot).not.toBeVisible();
}

// Iframe Modal
export async function testIframeModal(page: Page) {
  // Open the modal
  await page.click('button:text("Open Iframe Modal")');

  // Check if modal and iframe are visible
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();

  const iframe = page.frameLocator('iframe[title="External content"]');
  await expect(iframe.locator("body")).toBeVisible();

  // Close modal
  await page.click('button:text("Close")');
  await expect(modal).not.toBeVisible();
}

// Radix UI Modal
export async function testRadixModal(page: Page) {
  // Open the modal
  await page.click('button:text("Open Radix Modal")');

  // Check if modal is visible
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();

  // Test theme selection
  await page.click('label:has-text("Dark")');
  await page.click('button:text("Save Changes")');
  await expect(modal).not.toBeVisible();
}

// Example test suite
export async function testAllModals(page: Page) {
  // Navigate to the modal showcase page
  await page.goto("/modal-showcase");

  // Test each modal type
  await testStandardModal(page);
  await testPortalModal(page);
  await testShadowDomModal(page);
  await testIframeModal(page);
  await testRadixModal(page);
}
