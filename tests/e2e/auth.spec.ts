import { expect, test } from './fixtures';

test('login page renders its heading', async ({ page }) => {
  await page.goto('/auth/login');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /login/i,
    }),
  ).toBeVisible();
});

test('new account page renders its heading', async ({ page }) => {
  await page.goto('/auth/new-account');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /new account/i,
    }),
  ).toBeVisible();
});
