import { test, expect } from '../../src/fixtures/base-fixture';
// import * as path from 'path';
import { TestUtils } from '../../src/utils/test-utils';

test.describe('Contact Us form @e2e', () => {
  test.beforeEach(async ({ page }) => {
    await TestUtils.blockAds(page);
  });

  test.skip('Success: submit contact form with file upload', async ({ pom, userData }) => {
    test.info().annotations.push({ type: 'issue', description: 'needs to be fixed' });
    await pom.homePage.navigate();
    await pom.homePage.contactUsLink.click();
    await expect(pom.contactPage.page).toHaveURL(/contact_us/);
    await expect.soft(pom.contactPage.getInTouchHeading).toBeVisible();

    // const filePath = path.resolve(__dirname, '../fixtures/sample-upload.txt');
    await pom.contactPage.fillContactForm({
      name: userData.name,
      email: userData.email,
      subject: 'Test Subject',
      message: 'Test message for automation.',
      // filePath
    });

    await expect.soft(pom.contactPage.nameInput).toHaveValue(userData.name);
    await expect.soft(pom.contactPage.emailInput).toHaveValue(userData.email);
    await expect.soft(pom.contactPage.subjectInput).toHaveValue('Test Subject');
    await expect.soft(pom.contactPage.messageTextarea).toHaveValue('Test message for automation.');
    // await expect.soft(contactPage.fileInput).toHaveValue(filePath);

    const dialogMessage = await pom.contactPage.submitAndAcceptDialog();
    console.log(`Dialog message OUT: ${dialogMessage}`);

    await expect(pom.contactPage.successMessage).toBeVisible({ timeout: 15000 });
    await expect(pom.contactPage.successMessage).toHaveText(/success! your details have been submitted successfully/i);
  });
});
