import { expect, test } from '@playwright/test';

test('home page renders the starter heading', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /to get started, edit the page\.tsx file\./i,
    }),
  ).toBeVisible();
});
