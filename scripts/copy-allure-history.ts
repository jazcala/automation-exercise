#!/usr/bin/env npx ts-node
/**
 * Copies allure-report/history to allure-history/ for the next run's trends.
 * Run after allure generate (local only; CI uses gh-pages).
 */

import * as fs from 'fs';
import * as path from 'path';

const REPORT_HISTORY = path.join(process.cwd(), 'allure-report', 'history');
const ALLURE_HISTORY = path.join(process.cwd(), 'allure-history');

const FILES = [
  'history.json',
  'history-trend.json',
  'categories-trend.json',
  'duration-trend.json',
  'retry-trend.json',
];

function main(): void {
  if (process.env.CI) return;
  if (!fs.existsSync(REPORT_HISTORY)) return;

  if (!fs.existsSync(ALLURE_HISTORY)) {
    fs.mkdirSync(ALLURE_HISTORY, { recursive: true });
  }

  for (const f of FILES) {
    const src = path.join(REPORT_HISTORY, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(ALLURE_HISTORY, f));
    }
  }
  console.log('\n📂 Allure history saved to allure-history/ for next run\n');
}

main();
