import { expect, test } from './fixtures';

test('home product grid navigates to a product page', async ({ page }) => {
  await page.goto('/');

  await page.locator('a[href^="/product/"]').first().click();

  await expect(page).toHaveURL(/\/product\/.+/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /hello product page/i,
    }),
  ).toBeVisible();
});

test('products page renders its heading', async ({ page }) => {
  await page.goto('/products');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /hello products page/i,
    }),
  ).toBeVisible();
});
