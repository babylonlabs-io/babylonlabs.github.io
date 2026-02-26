import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  // Navigate to a doc page
  await page.goto('http://localhost:3333/guides/overview/babylon_genesis/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Screenshot 1: Page with dropdown trigger visible
  await page.screenshot({ path: '/tmp/test-386-page-load.png', fullPage: false });
  console.log('Screenshot 1: Page loaded - /tmp/test-386-page-load.png');

  // Check if page-actions-dropdown exists
  const dropdown = await page.$('.page-actions-dropdown');
  if (dropdown) {
    console.log('OK: PageActionsDropdown found on page');
  } else {
    console.log('FAIL: PageActionsDropdown NOT found on page');
  }

  // Click the trigger button to open dropdown
  const trigger = await page.$('.page-actions-trigger');
  if (trigger) {
    await trigger.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: '/tmp/test-386-dropdown-open.png', fullPage: false });
    console.log('Screenshot 2: Dropdown open - /tmp/test-386-dropdown-open.png');

    // Check for "Ask Babylon AI" menu item
    const aiItem = await page.$('.page-actions-item--ai');
    if (aiItem) {
      console.log('OK: "Ask Babylon AI" menu item found');
      const text = await aiItem.textContent();
      console.log('   Text:', text.trim());
    } else {
      console.log('FAIL: "Ask Babylon AI" menu item NOT found');
    }

    // Check all menu items
    const items = await page.$$('.page-actions-item');
    console.log(`OK: ${items.length} menu items total`);
    for (const item of items) {
      const text = await item.textContent();
      console.log('   -', text.trim());
    }

    // Close dropdown
    await page.click('body');
    await page.waitForTimeout(200);
  }

  // Test text selection toolbar
  // Select some text in the article
  const article = await page.$('article .markdown p');
  if (article) {
    // Triple-click to select paragraph text
    await article.click({ clickCount: 3 });
    await page.waitForTimeout(200);

    // Check for selection toolbar
    const toolbar = await page.$('.text-selection-toolbar');
    if (toolbar) {
      console.log('OK: TextSelectionToolbar appeared on text selection');
      await page.screenshot({ path: '/tmp/test-386-selection-toolbar.png', fullPage: false });
      console.log('Screenshot 3: Selection toolbar - /tmp/test-386-selection-toolbar.png');

      const buttons = await toolbar.$$('.text-selection-toolbar-btn');
      console.log(`OK: ${buttons.length} toolbar buttons`);
      for (const btn of buttons) {
        const text = await btn.textContent();
        console.log('   -', text.trim());
      }
    } else {
      console.log('NOTE: TextSelectionToolbar not visible (may need different selection method)');
    }
  }

  // Check doc-content-with-actions wrapper
  const wrapper = await page.$('.doc-content-with-actions');
  if (wrapper) {
    console.log('OK: doc-content-with-actions wrapper found');
  } else {
    console.log('FAIL: doc-content-with-actions wrapper NOT found');
  }

  await browser.close();
  console.log('\nAll checks complete.');
})();
