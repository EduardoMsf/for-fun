import { expect, test } from './fixtures';

test('home page renders the shop heading', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Tienda/i,
    }),
  ).toBeVisible();

  await expect(page.getByText(/Todos los productos/i)).toBeVisible();
});
