import fs from 'node:fs/promises';
import path from 'node:path';
import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

type CoverageRange = {
  count: number;
  endOffset: number;
  startOffset: number;
};

type CoverageFunction = {
  functionName: string;
  isBlockCoverage: boolean;
  ranges: CoverageRange[];
};

type CoverageEntry = {
  functions: CoverageFunction[];
  scriptId: string;
  url: string;
};

const shouldCollectCoverage = () =>
  process.env.PW_E2E_COVERAGE === '1' || process.env.PW_E2E_COVERAGE === 'true';

const writeCoverage = async (page: Page, testInfoOutputPath: string) => {
  const session = await page.context().newCDPSession(page);

  await session.send('Profiler.enable');
  await session.send('Profiler.startPreciseCoverage', {
    allowTriggeredUpdates: false,
    callCount: false,
    detailed: true,
  });

  return async () => {
    const { result } = await session.send('Profiler.takePreciseCoverage');
    await session.send('Profiler.stopPreciseCoverage');
    await session.send('Profiler.disable');

    const outputDir = path.dirname(testInfoOutputPath);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(
      testInfoOutputPath,
      JSON.stringify(result as CoverageEntry[], null, 2),
      'utf8',
    );
  };
};

export { expect };

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (!shouldCollectCoverage() || testInfo.project.name !== 'chromium') {
      await use(page);
      return;
    }

    const stopCoverage = await writeCoverage(page, testInfo.outputPath('coverage.json'));

    try {
      await use(page);
    } finally {
      await stopCoverage();
    }
  },
});
