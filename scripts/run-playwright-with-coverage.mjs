import { spawnSync } from 'node:child_process';

const playwrightArgs = ['playwright', 'test', ...process.argv.slice(2)];
const playwrightCommand =
  process.platform === 'win32'
    ? ['cmd.exe', ['/c', 'npx', ...playwrightArgs]]
    : ['npx', playwrightArgs];

const playwrightRun = spawnSync(playwrightCommand[0], playwrightCommand[1], {
  env: {
    ...process.env,
    PW_E2E_COVERAGE: '1',
  },
  shell: false,
  stdio: 'inherit',
});

const reportRun = spawnSync(
  process.execPath,
  ['scripts/generate-playwright-coverage-report.mjs'],
  {
    shell: false,
    stdio: 'inherit',
  },
);

if (playwrightRun.error) {
  throw playwrightRun.error;
}

if (reportRun.error) {
  throw reportRun.error;
}

process.exit(playwrightRun.status ?? 1);
