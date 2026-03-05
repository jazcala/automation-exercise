#!/usr/bin/env npx ts-node
/**
 * Writes allure-results/environment.properties with API_Coverage, Success_Rate, Flaky_Tests.
 * Run before allure generate so the Environment widget shows these values.
 */

import * as fs from 'fs';
import * as path from 'path';
import { computeMetrics } from './generate-metrics';
import { getApiCoverage } from './api-coverage';

const ALLURE_RESULTS = path.join(process.cwd(), 'allure-results');
const ENV_FILE = path.join(ALLURE_RESULTS, 'environment.properties');

function writeAllureEnv(): void {
  const metrics = computeMetrics(true);
  const apiCoverage = getApiCoverage();

  if (!fs.existsSync(ALLURE_RESULTS)) {
    fs.mkdirSync(ALLURE_RESULTS, { recursive: true });
  }

  const lines: string[] = [
    `Run_Environment=${process.env.CI ? 'GitHub Actions' : 'Local Developer Machine'}`,
    `API_Coverage=${apiCoverage}%`,
    `Success_Rate=${metrics ? `${metrics.successRate}%` : 'N/A'}`,
    `Flaky_Tests=${metrics?.flakyCount ?? 0}`,
    `Trends_Chart=trends-chart.html`,
  ];

  fs.writeFileSync(ENV_FILE, lines.join('\n') + '\n', 'utf-8');
  console.log(`\n📋 Allure environment.properties written to ${ENV_FILE}\n`);
}

writeAllureEnv();
