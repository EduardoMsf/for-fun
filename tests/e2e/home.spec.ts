import { expect, test } from '@playwright/test';

test('home page renders the already started heading', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Already started. The CI\/CD and testing setup is ready\./i,
    }),
  ).toBeVisible();
});
