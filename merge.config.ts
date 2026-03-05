import { defineConfig } from '@playwright/test';

/**
 * Config for merge-reports when generating JSON output for metrics.
 * Use: npx playwright merge-reports --config=merge.config.ts --reporter=json ./all-blob-reports
 */
export default defineConfig({
  reporter: [['json', { outputFile: 'test-results.json' }]],
});
