#!/usr/bin/env npx ts-node
/**
 * API Coverage Tracker: reads coverage-map.json and outputs total % coverage.
 * Update coverage-map.json to mark endpoints as automated: true/false.
 */

import * as fs from 'fs';
import * as path from 'path';

const COVERAGE_MAP = path.join(process.cwd(), 'coverage-map.json');

interface Endpoint {
  method: string;
  path: string;
  description: string;
  automated: boolean;
}

interface CoverageMap {
  description: string;
  basePath: string;
  endpoints: Endpoint[];
}

/** Returns API coverage percentage as string (e.g. "85.5"). Returns "0" if file missing. */
export function getApiCoverage(): string {
  if (!fs.existsSync(COVERAGE_MAP)) return '0';
  const raw = fs.readFileSync(COVERAGE_MAP, 'utf-8');
  const map: CoverageMap = JSON.parse(raw);
  const automated = map.endpoints.filter((e) => e.automated).length;
  const total = map.endpoints.length;

  return total > 0 ? ((automated / total) * 100).toFixed(1) : '0';
}

function calculateApiCoverage(): void {
  if (!fs.existsSync(COVERAGE_MAP)) {
    console.error(`\n❌ coverage-map.json not found at ${COVERAGE_MAP}\n`);
    process.exit(1);
  }

  const raw = fs.readFileSync(COVERAGE_MAP, 'utf-8');
  const map: CoverageMap = JSON.parse(raw);
  const { endpoints } = map;

  const automated = endpoints.filter((e) => e.automated).length;
  const total = endpoints.length;
  const coveragePct = getApiCoverage();

  console.log('\n📡 API Coverage Summary\n');
  console.log('| Metric           | Value |');
  console.log('|------------------|-------|');
  console.log(`| Total Endpoints  | ${total} |`);
  console.log(`| Automated        | ${automated} |`);
  console.log(`| Coverage         | ${coveragePct}% |`);
  console.log('');
}

if (require.main === module) {
  calculateApiCoverage();
}
