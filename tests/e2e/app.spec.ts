import { test, expect } from '@playwright/test';

test.describe('Publishing OS', () => {
  test('app loads without errors', async ({ page }) => {
    await page.goto('/');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should have navigation
    await expect(page.getByRole('navigation')).toBeVisible();

    // Should show page title
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate to projects
    await page.getByRole('link', { name: /projects/i }).click();
    await expect(page).toHaveURL('/projects');

    // Navigate to exports
    await page.getByRole('link', { name: /exports/i }).click();
    await expect(page).toHaveURL('/exports');

    // Navigate to settings
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page).toHaveURL('/settings');
  });

  test('can view demo data', async ({ page }) => {
    await page.goto('/projects');

    // Should show demo projects
    const projectCards = page.locator('[data-testid="project-card"]');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
