import { request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(): Promise<void> {
  const authDir: string = path.resolve('playwright/.auth');
  const userDetailsFile: string = path.join(authDir, 'setup-user.json');
  const sessionFile: string = path.join(authDir, 'user.json');

  if (fs.existsSync(userDetailsFile)) {
    const userData = JSON.parse(fs.readFileSync(userDetailsFile, 'utf-8'));
    const apiContext = await request.newContext();

    console.log(`🧹 Deleting Global Setup User: ${userData.email}`);

    // 1. Delete user from DB via API
    await apiContext.post('https://automationexercise.com/api/deleteAccount', {
      form: {
        email: userData.email,
        password: userData.password
      }
    });

    await apiContext.dispose();

    // 2. Remove all temporary auth files
    [userDetailsFile, sessionFile].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    // Remove the .auth folder itself if it's empty
    if (fs.existsSync(authDir) && fs.readdirSync(authDir).length === 0) {
      fs.rmdirSync(authDir);
    }

    console.log('✨ Environment is clean. Session and User data removed.');
  }
}

export default globalTeardown;
