import { expect, test } from '@playwright/test';

test('home page renders the already started heading', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Here is where everything starts/i,
    }),
  ).toBeVisible();
});
