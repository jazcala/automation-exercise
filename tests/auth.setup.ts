import { test, expect } from '../src/fixtures/base-fixture';
import * as fs from 'fs';
import * as path from 'path';

const authDir: string = path.resolve('playwright/.auth');
const authFile: string = path.join(authDir, 'user.json');
const userDetailsFile: string = path.join(authDir, 'setup-user.json');

test.describe('Global Authentication', () => {
  test('Login User with correct email and password and save state', async ({
    loginReadyPage, persistentUser, page
  }) => {
    const { email, password, name } = persistentUser;
    fs.mkdirSync(authDir, { recursive: true });

    const homePage = await loginReadyPage.login(email, password);
    fs.writeFileSync(userDetailsFile, JSON.stringify(persistentUser));

    await expect(homePage.loggedAsLink).toBeVisible();
    await expect(homePage.loggedAsLink).toHaveText(`Logged in as ${name}`);

    // Save state for all other tests
    await page.context().storageState({ path: authFile });
  });
});
