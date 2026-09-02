import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Test 1: API page
  console.log('--- Test 1: API doc page ---');
  const page1 = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page1.goto('http://localhost:3333/api/staking-api/', { waitUntil: 'networkidle' });
  await page1.waitForTimeout(2000);

  const apiDropdown = await page1.$('.page-actions-dropdown');
  console.log(apiDropdown ? 'OK: PageActionsDropdown on API page' : 'FAIL: No dropdown on API page');
  await page1.screenshot({ path: '/tmp/test-386-api-page.png', fullPage: false });
  console.log('Screenshot: /tmp/test-386-api-page.png');
  await page1.close();

  // Test 2: Mobile viewport - toolbar should be hidden
  console.log('\n--- Test 2: Mobile viewport ---');
  const page2 = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page2.goto('http://localhost:3333/guides/overview/babylon_genesis/', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(2000);

  // Check dropdown on mobile (should show in static position)
  const mobileDropdown = await page2.$('.page-actions-dropdown');
  console.log(mobileDropdown ? 'OK: Dropdown present on mobile' : 'NOTE: Dropdown not found on mobile');

  // Select text on mobile
  const mobileArticle = await page2.$('article .markdown p');
  if (mobileArticle) {
    await mobileArticle.click({ clickCount: 3 });
    await page2.waitForTimeout(200);
    const mobileToolbar = await page2.$('.text-selection-toolbar');
    // Toolbar should be hidden on mobile via CSS
    const isVisible = mobileToolbar ? await mobileToolbar.isVisible() : false;
    console.log(isVisible ? 'NOTE: Selection toolbar visible on mobile (should be hidden)' : 'OK: Selection toolbar hidden on mobile (correct)');
  }

  await page2.screenshot({ path: '/tmp/test-386-mobile.png', fullPage: false });
  console.log('Screenshot: /tmp/test-386-mobile.png');
  await page2.close();

  // Test 3: Light theme
  console.log('\n--- Test 3: Light theme ---');
  const page3 = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page3.goto('http://localhost:3333/guides/overview/babylon_genesis/', { waitUntil: 'networkidle' });
  await page3.waitForTimeout(1000);
  // Switch to light mode
  await page3.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await page3.waitForTimeout(500);

  // Open dropdown in light mode
  const lightTrigger = await page3.$('.page-actions-trigger');
  if (lightTrigger) {
    await lightTrigger.click();
    await page3.waitForTimeout(300);
  }
  await page3.screenshot({ path: '/tmp/test-386-light-theme.png', fullPage: false });
  console.log('Screenshot: /tmp/test-386-light-theme.png');
  await page3.close();

  await browser.close();
  console.log('\nAll extra tests complete.');
})();
