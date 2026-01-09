import { Page } from '@playwright/test';

export class TestUtils {

  static async blockAds(page: Page): Promise<void> {
    // 1. Network level blocking
    await page.route('**/*', (route) => {
      const url = route.request().url();
      const adDomains = ['googleads', 'doubleclick', 'adservice', 'analytics', 'carbonads'];
      if (adDomains.some(domain => url.includes(domain))) {
        route.abort();
      } else {
        route.continue();
      }
    });

    // 2. Add an init script to ensure CSS is applied even if the page reloads
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = '.adsbygoogle, [id^="google_ads"], iframe[id^="aswift"] { display: none !important; }';
      document.head.appendChild(style);
    });
  }

  static async prepareForScreenshot(page: Page): Promise<void> {
    // 1. Normalize fonts, animations, and UI noise
    await page.addStyleTag({
      content: `
      /* Apply Arial to everything EXCEPT FontAwesome icons */
      *:not(.fa):not(.fas):not(.fab):not(.far):not(.fa-solid):not(.fa-regular) {
        font-family: Arial, sans-serif !important;
      }

      /* Keep animations off for stability */
      * {
        transition: none !important;
        animation: none !important;
        scroll-behavior: auto !important;
      }

      ::-webkit-scrollbar { display: none !important; }
      input { caret-color: transparent !important; }
    `,
    });

    // 2. Ensure all fonts are rendered
    await page.evaluate(() => document.fonts.ready);

    // 3. Smart Scroll: Trigger lazy loading (Images/Footers)
    await page.evaluate(async () => {
      const distance = 100;
      const delay = 100;
      while (document.scrollingElement!.scrollTop + window.innerHeight < document.scrollingElement!.scrollHeight) {
        window.scrollBy(0, distance);
        await new Promise(res => setTimeout(res, delay));
      }
      window.scrollTo(0, 0);
    });

    await page.evaluate(() => new Promise(requestAnimationFrame));
  }
}
