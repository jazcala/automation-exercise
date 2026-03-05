#!/usr/bin/env npx ts-node
/**
 * Generates trends-chart.html and a single-page dashboard (index.html) with Allure + Trends.
 * Run after allure generate: npm run trends:chart
 */

import * as fs from 'fs';
import * as path from 'path';
import type { TrendEntry } from './update-trends';

const TRENDS_FILE = path.join(process.cwd(), 'data', 'trends.json');
const REPORT_DIR = path.join(process.cwd(), 'allure-report');
const CHART_FILE = path.join(REPORT_DIR, 'trends-chart.html');

function writeDashboard(hasTrends: boolean): void {
  const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Quality Report</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; }
    .tabs { display: flex; background: #2d3748; padding: 0 8px; }
    .tabs a { color: #a0aec0; padding: 10px 16px; text-decoration: none; font-size: 14px; }
    .tabs a:hover { color: #fff; }
    .tabs a.active { color: #fff; border-bottom: 2px solid #4299e1; }
    .tabs a.disabled { opacity: 0.5; pointer-events: none; }
    iframe { width: 100%; height: calc(100vh - 40px); border: none; display: block; background:white; }
  </style>
</head>
<body>
  <nav class="tabs">
    <a href="#" class="active" data-view="allure">Allure Report</a>
    <a href="#" data-view="trends" ${hasTrends ? '' : 'class="disabled" title="Run: npm run metrics && npm run trends"'}>Trends</a>
  </nav>
  <iframe id="frame" src="allure.html" title="Report"></iframe>
  <script>
    document.querySelectorAll('.tabs a:not(.disabled)').forEach(a => {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var view = this.dataset.view;
        document.getElementById('frame').src = view === 'trends' ? 'trends-chart.html' : 'allure.html';
        document.querySelectorAll('.tabs a').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
      });
    });
  </script>
</body>
</html>`;

  const indexPath = path.join(REPORT_DIR, 'index.html');
  const allurePath = path.join(REPORT_DIR, 'allure.html');
  if (fs.existsSync(indexPath)) {
    fs.renameSync(indexPath, allurePath);
  }
  fs.writeFileSync(indexPath, dashboardHtml, 'utf-8');
  console.log(`\n📋 Dashboard written (Allure + Trends on same page)\n`);
}

function generateChart(): void {
  if (!fs.existsSync(TRENDS_FILE)) {
    console.log('\n⏭️  data/trends.json not found. Run: npm run metrics && npm run trends\n');

    return;
  }

  const raw = fs.readFileSync(TRENDS_FILE, 'utf-8');
  const trends: TrendEntry[] = JSON.parse(raw);
  if (trends.length === 0) {
    console.log('\n⏭️  No trend data. Run: npm run metrics && npm run trends\n');

    return;
  }

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const successRates = trends.map((t) => t.successRate);
  const min = Math.min(...successRates, 0);
  const max = Math.max(...successRates, 100);
  const range = max - min || 1;

  const points = successRates
    .map(
      (v, i) =>
        `${padding.left + (i / (trends.length - 1 || 1)) * chartWidth},${padding.top + chartHeight - ((v - min) / range) * chartHeight}`
    )
    .join(' ');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Trends</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 20px; }
    .back { margin-bottom: 16px; }
    .back a { color: #4361ee; text-decoration: none; }
    .back a:hover { text-decoration: underline; }
    h2 { margin: 0 0 10px 0; }
    .chart { background: #f8f9fa; border-radius: 8px; padding: 16px; }
    table { border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 6px 12px; text-align: left; border: 1px solid #ddd; }
    th { background: #f1f3f4; }
  </style>
</head>
<body>
  <div class="back"><a href="index.html">← Back to Report</a></div>
  <h2>Test Success Rate Trend</h2>
  <div class="chart">
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <polyline fill="none" stroke="#1976d2" stroke-width="2" points="${points}"/>
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#ccc" stroke-width="1"/>
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#ccc" stroke-width="1"/>
      <text x="${padding.left - 5}" y="${padding.top + 4}" font-size="10" fill="#666">${max}%</text>
      <text x="${padding.left - 5}" y="${height - padding.bottom + 4}" font-size="10" fill="#666">${min}%</text>
    </svg>
  </div>
  <h3>Recent Runs</h3>
  <table>
    <thead><tr><th>Date</th><th>Success Rate</th><th>API Coverage</th><th>Flaky</th><th>Total</th><th>Duration (ms)</th></tr></thead>
    <tbody>
      ${trends
      .slice()
      .reverse()
      .map(
        (t) =>
          `<tr><td>${new Date(t.timestamp).toLocaleString()}</td><td>${t.successRate}%</td><td>${t.apiCoverage}%</td> <td>${t.flakyCount}</td><td>${t.totalTests}</td><td>${t.duration}</td></tr>`
      )
      .join('')}
    </tbody>
  </table>
</body>
</html>`;

  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
  fs.writeFileSync(CHART_FILE, html, 'utf-8');
  console.log(`\n📈 Trends chart written to ${CHART_FILE}\n`);
}

function main(): void {
  let hasTrends = false;
  if (fs.existsSync(TRENDS_FILE)) {
    const raw = fs.readFileSync(TRENDS_FILE, 'utf-8');
    const trends: TrendEntry[] = JSON.parse(raw);
    if (trends.length > 0) {
      hasTrends = true;
      generateChart();
    } else {
      console.log('\n⏭️  No trend data. Run: npm run metrics && npm run trends\n');
    }
  } else {
    console.log('\n⏭️  data/trends.json not found. Run: npm run metrics && npm run trends\n');
  }
  writeDashboard(hasTrends);
}

main();
