import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const testResultsDir = path.join(rootDir, 'test-results');
const reportDir = path.join(rootDir, 'e2e-coverage');
const rawDir = path.join(reportDir, 'raw');

const toPosix = (value) => value.replaceAll('\\', '/');

const collectFiles = (dir, fileName, results = []) => {
  if (!fs.existsSync(dir)) {
    return results;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, fileName, results);
      continue;
    }

    if (entry.isFile() && entry.name === fileName) {
      results.push(fullPath);
    }
  }

  return results;
};

const mergeRanges = (ranges) => {
  if (ranges.length === 0) {
    return [];
  }

  const sortedRanges = [...ranges].sort((left, right) => left.start - right.start);
  const merged = [sortedRanges[0]];

  for (const range of sortedRanges.slice(1)) {
    const current = merged.at(-1);
    if (range.start <= current.end) {
      current.end = Math.max(current.end, range.end);
      continue;
    }

    merged.push({ ...range });
  }

  return merged;
};

const sanitizeFileName = (value) =>
  value.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');

const coverageFiles = collectFiles(testResultsDir, 'coverage.json');

if (coverageFiles.length === 0) {
  console.log('No e2e coverage artifacts were found in test-results.');
  process.exit(0);
}

const byScript = new Map();

for (const filePath of coverageFiles) {
  const entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const entry of entries) {
    if (typeof entry.url !== 'string' || entry.url.length === 0) {
      continue;
    }

    if (
      !entry.url.includes('/_next/static/') &&
      !entry.url.includes('http://127.0.0.1:3000') &&
      !entry.url.includes('http://localhost:3000')
    ) {
      continue;
    }

    const scriptCoverage = byScript.get(entry.url) ?? {
      ranges: [],
      totalBytes: 0,
      url: entry.url,
    };

    for (const fn of entry.functions ?? []) {
      for (const range of fn.ranges ?? []) {
        scriptCoverage.totalBytes = Math.max(
          scriptCoverage.totalBytes,
          range.endOffset,
        );

        if (range.count > 0) {
          scriptCoverage.ranges.push({
            end: range.endOffset,
            start: range.startOffset,
          });
        }
      }
    }

    byScript.set(entry.url, scriptCoverage);
  }
}

const rows = [...byScript.values()]
  .map((script) => {
    const merged = mergeRanges(script.ranges);
    const usedBytes = merged.reduce(
      (total, range) => total + (range.end - range.start),
      0,
    );
    const totalBytes = script.totalBytes;
    const percent = totalBytes === 0 ? 0 : (usedBytes / totalBytes) * 100;

    return {
      percent,
      totalBytes,
      url: script.url,
      usedBytes,
    };
  })
  .sort((left, right) => right.percent - left.percent);

const totals = rows.reduce(
  (accumulator, row) => {
    accumulator.totalBytes += row.totalBytes;
    accumulator.usedBytes += row.usedBytes;
    return accumulator;
  },
  { totalBytes: 0, usedBytes: 0 },
);

const overallPercent =
  totals.totalBytes === 0 ? 0 : (totals.usedBytes / totals.totalBytes) * 100;

fs.rmSync(reportDir, { force: true, recursive: true });
fs.mkdirSync(rawDir, { recursive: true });

for (const row of rows) {
  const fileName = `${sanitizeFileName(row.url)}.json`;
  fs.writeFileSync(
    path.join(rawDir, fileName),
    JSON.stringify(row, null, 2),
    'utf8',
  );
}

const summary = {
  generatedAt: new Date().toISOString(),
  overall: {
    percent: Number(overallPercent.toFixed(2)),
    totalBytes: totals.totalBytes,
    usedBytes: totals.usedBytes,
  },
  scripts: rows.map((row) => ({
    percent: Number(row.percent.toFixed(2)),
    totalBytes: row.totalBytes,
    url: row.url,
    usedBytes: row.usedBytes,
  })),
};

fs.writeFileSync(
  path.join(reportDir, 'summary.json'),
  JSON.stringify(summary, null, 2),
  'utf8',
);

const tableRows = rows
  .map(
    (row) => `
      <tr>
        <td><code>${row.url}</code></td>
        <td>${row.percent.toFixed(2)}%</td>
        <td>${row.usedBytes}</td>
        <td>${row.totalBytes}</td>
      </tr>`,
  )
  .join('');

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Playwright E2E Coverage</title>
    <style>
      :root {
        color-scheme: light;
        font-family: "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        background: #f4f6f8;
        color: #1f2933;
      }
      main {
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 20px 48px;
      }
      h1, h2, p {
        margin-top: 0;
      }
      .card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        margin-bottom: 20px;
      }
      .metric {
        font-size: 48px;
        font-weight: 700;
        color: #0f766e;
      }
      .caption {
        color: #52606d;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        text-align: left;
        padding: 12px 10px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: top;
      }
      th {
        font-size: 14px;
        color: #52606d;
      }
      code {
        word-break: break-all;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <main>
      <section class="card">
        <h1>Playwright E2E Coverage</h1>
        <p class="caption">
          This report measures JavaScript bytes executed in Chromium for the app bundles loaded during the E2E run.
        </p>
        <div class="metric">${overallPercent.toFixed(2)}%</div>
        <p class="caption">
          ${totals.usedBytes} used bytes out of ${totals.totalBytes} total bytes across ${rows.length} loaded scripts.
        </p>
      </section>
      <section class="card">
        <h2>Per Script</h2>
        <table>
          <thead>
            <tr>
              <th>Script</th>
              <th>Coverage</th>
              <th>Used Bytes</th>
              <th>Total Bytes</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </section>
    </main>
  </body>
</html>`;

fs.writeFileSync(path.join(reportDir, 'index.html'), html, 'utf8');

console.log(`Playwright E2E coverage summary: ${overallPercent.toFixed(2)}%`);
console.log(`HTML report: ${toPosix(path.relative(rootDir, path.join(reportDir, 'index.html')))}`);
