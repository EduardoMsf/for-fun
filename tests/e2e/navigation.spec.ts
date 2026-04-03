import { expect, test } from './fixtures';

test('top menu navigates to the men category page', async ({ page }) => {
  await page.goto('/');

  await page.locator('a[href="/category/men"]').click();

  await expect(page).toHaveURL(/\/category\/men$/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /hello category page/i,
    }),
  ).toBeVisible();
  await expect(page.getByText('-men')).toBeVisible();
});

test('sidebar opens and shows its navigation links', async ({ page }) => {
  await page.goto('/');

  await page.locator('button').click();

  await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /profile/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /clients/i })).toBeVisible();
});

test('cart link navigates to the cart page', async ({ page }) => {
  await page.goto('/');

  await page.locator('a[href="/cart"]').click();

  await expect(page).toHaveURL(/\/cart$/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /hello cart page/i,
    }),
  ).toBeVisible();
});
