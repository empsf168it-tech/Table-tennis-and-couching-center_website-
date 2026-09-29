const playwright = require('playwright');
const path = require('path');

(async () => {
    const browser = await playwright.chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:8080/index.html');
    
    // Toggle RTL mode
    await page.evaluate(() => {
        document.documentElement.dir = 'rtl';
    });
    
    // Wait for the elements to load
    await page.waitForSelector('.header-actions');
    
    // Capture screenshot of the header in RTL mode
    const header = await page.$('header');
    await header.screenshot({ path: path.join(__dirname, 'header-screenshot-rtl.png') });
    
    await browser.close();
})();
