import { Page } from '@playwright/test';

export class TestUtils {

  static async blockAds(page: Page): Promise<void> {
    //Network level blocking
    await page.route('**/*', (route) => {

      const url = route.request().url();
      const adDomains = ['googleads', 'doubleclick', 'adservice', 'analytics'];
      if (adDomains.some(domain => url.includes(domain))) {
        route.abort();
      } else {
        route.continue();
      }

    });

    //Layout level masking (CSS )
    page.on('domcontentloaded', async () => {

      await page.addStyleTag({
        content: '.adsbygoogle, [id^="google_ads"] { display: none !important; }'
      });
    });

  }

}
