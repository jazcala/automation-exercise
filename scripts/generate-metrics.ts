#!/usr/bin/env npx ts-node
/**
 * Lightweight metrics utility: reads Playwright test-results.json and outputs a summary.
 * Run after any test suite: npx playwright test && npm run metrics
 * Works for API, E2E, guest, logged-in, visual, and full suite runs.
 */

import * as fs from 'fs';
import * as path from 'path';

const RESULTS_FILE = path.join(process.cwd(), 'test-results.json');

interface TestResult {
  status: string;
  duration: number;
}

interface Test {
  projectId?: string;
  projectName?: string;
  results?: TestResult[];
}

interface Spec {
  ok: boolean;
  tests?: Test[];
  specs?: Spec[];
  suites?: Suite[];
}

interface Suite {
  specs?: Spec[];
  suites?: Suite[];
}

interface PlaywrightReport {
  suites?: Suite[];
}

interface ProjectStats {
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
}

function collectSpecs(suites: Suite[] | undefined): Spec[] {
  const specs: Spec[] = [];
  if (!suites) return specs;

  for (const suite of suites) {
    if (suite.specs) specs.push(...suite.specs);
    if (suite.suites) specs.push(...collectSpecs(suite.suites));
  }

  return specs;
}

function getSpecStatus(spec: Spec): 'passed' | 'failed' | 'skipped' {
  if (spec.ok) return 'passed';
  const status = spec.tests?.[0]?.results?.[0]?.status;
  if (status === 'skipped') return 'skipped';

  return 'failed';
}

/** A spec is flaky if it passed but had multiple results with at least one prior failure. */
function isSpecFlaky(spec: Spec): boolean {
  if (!spec.ok) return false;
  for (const test of spec.tests ?? []) {
    const results = test.results ?? [];
    if (results.length < 2) continue;
    const last = results[results.length - 1];
    if (last?.status !== 'passed') continue;
    const hadPriorFailure = results.some(
      (r, i) => i < results.length - 1 && r.status !== 'passed' && r.status !== 'skipped'
    );

    if (hadPriorFailure) {
      return true;
    }
  }

  return false;
}

function getSpecDuration(spec: Spec): number {
  const result = spec.tests?.[0]?.results?.[0];

  return result?.duration ?? 0;
}

function getSpecProject(spec: Spec): string {
  return spec.tests?.[0]?.projectName ?? 'unknown';
}

export interface MetricsResult {
  successRate: number;
  flakyCount: number;
  totalTests: number;
  duration: number;
  passed: number;
  failed: number;
  skipped: number;
}

export function computeMetrics(silent = false): MetricsResult | null {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.error(`\n❌ test-results.json not found. Run tests first:\n   npx playwright test\n`);

    return null;
  }

  const raw = fs.readFileSync(RESULTS_FILE, 'utf-8');
  const report: PlaywrightReport = JSON.parse(raw);

  const allSpecs = collectSpecs(report.suites ?? []);
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let flaky = 0;
  let totalDuration = 0;

  const byProject = new Map<string, ProjectStats>();

  for (const spec of allSpecs) {
    const status = getSpecStatus(spec);
    const duration = getSpecDuration(spec);
    const project = getSpecProject(spec);
    const flakySpec = isSpecFlaky(spec);

    if (status === 'passed') passed++;
    else if (status === 'failed') failed++;
    else skipped++;
    if (flakySpec) flaky++;
    totalDuration += duration;

    const stats = byProject.get(project) ?? { passed: 0, failed: 0, skipped: 0, flaky: 0, duration: 0 };
    if (status === 'passed') stats.passed++;
    else if (status === 'failed') stats.failed++;
    else stats.skipped++;
    if (flakySpec) stats.flaky++;
    stats.duration += duration;
    byProject.set(project, stats);
  }

  const total = passed + failed + skipped;
  const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

  if (!silent) {
    console.log('\n📊 Test Metrics Summary\n');
    console.log('| Metric        | Value |');
    console.log('|---------------|-------|');
    console.log(`| Success Rate  | ${successRate}% |`);
    console.log(`| Total Duration| ${totalDuration} ms |`);
    console.log(`| Passed        | ${passed} |`);
    console.log(`| Failed        | ${failed} |`);
    console.log(`| Flaky         | ${flaky} |`);
    console.log(`| Skipped       | ${skipped} |`);
    console.log(`| Total         | ${total} |`);

    if (byProject.size > 1) {
      console.log('\n--- By Project ---');
      console.log('| Project            | Passed | Failed | Flaky | Skipped | Duration (ms) |');
      console.log('|--------------------|--------|--------|-------|---------|---------------|');
      for (const [project, stats] of [...byProject.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
        console.log(`| ${project.padEnd(18)} | ${String(stats.passed).padStart(6)} | ${String(stats.failed).padStart(6)} | ${String(stats.flaky).padStart(5)} | ${String(stats.skipped).padStart(7)} | ${String(stats.duration).padStart(13)} |`);
      }
    }
    console.log('');
  }

  return {
    successRate: parseFloat(successRate),
    flakyCount: flaky,
    totalTests: total,
    duration: totalDuration,
    passed,
    failed,
    skipped,
  };
}

function main(): void {
  const result = computeMetrics();
  if (!result) process.exit(1);
}

if (require.main === module) {
  main();
}
