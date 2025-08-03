import { test, expect } from '@playwright/test';

test.describe('Asset Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/');
    await page.evaluate(() => {
      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_at: Date.now() + 3600000,
        user: {
          id: 'mock-user-id',
          email: 'test@example.com'
        }
      };
      localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
    });

    // Mock Supabase API responses
    await page.route('**/rest/v1/assets*', async (route) => {
      const method = route.request().method();
      const url = route.request().url();

      if (method === 'GET') {
        // Mock GET assets
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'content-range': '0-1/2'
          },
          body: JSON.stringify([
            {
              id: '1',
              user_id: 'mock-user-id',
              symbol: 'EURUSD',
              name: 'Euro / US Dollar',
              description: 'Major currency pair',
              created_at: '2023-01-01T00:00:00Z'
            },
            {
              id: '2',
              user_id: 'mock-user-id',
              symbol: 'GBPUSD',
              name: 'British Pound / US Dollar',
              description: null,
              created_at: '2023-01-02T00:00:00Z'
            }
          ])
        });
      } else if (method === 'POST') {
        // Mock POST create asset
        const body = await route.request().postData();
        const data = JSON.parse(body || '{}');
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: '3',
            user_id: 'mock-user-id',
            ...data,
            created_at: new Date().toISOString()
          }])
        });
      } else if (method === 'PATCH') {
        // Mock PATCH update asset
        const body = await route.request().postData();
        const data = JSON.parse(body || '{}');
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: '1',
            user_id: 'mock-user-id',
            ...data,
            created_at: '2023-01-01T00:00:00Z'
          }])
        });
      } else if (method === 'DELETE') {
        // Mock DELETE asset
        route.fulfill({
          status: 204,
          contentType: 'application/json',
          body: ''
        });
      }
    });

    // Mock auth session validation
    await page.route('**/auth/v1/user**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-user-id',
          email: 'test@example.com',
          email_confirmed_at: new Date().toISOString(),
        })
      });
    });
  });

  test('should display asset management page correctly', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Check page elements
    await expect(page.getByText('Asset Management')).toBeVisible();
    await expect(page.getByText('Manage your trading assets for creating reports.')).toBeVisible();
    await expect(page.getByRole('button', { name: /add asset/i })).toBeVisible();

    // Check assets are loaded
    await expect(page.getByText('EURUSD')).toBeVisible();
    await expect(page.getByText('GBPUSD')).toBeVisible();
    await expect(page.getByText('Euro / US Dollar')).toBeVisible();
    await expect(page.getByText('British Pound / US Dollar')).toBeVisible();
  });

  test('should show loading state while fetching assets', async ({ page }) => {
    // Mock slow response
    await page.route('**/rest/v1/assets*', async (route) => {
      if (route.request().method() === 'GET') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'content-range': '0-0/0' },
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/dashboard/assets');

    // Check loading state
    await expect(page.getByText('Loading assets...')).toBeVisible();
  });

  test('should create new asset successfully', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Wait for assets to load
    await expect(page.getByText('EURUSD')).toBeVisible();

    // Click add asset button
    await page.getByRole('button', { name: /add asset/i }).click();

    // Check dialog opened
    await expect(page.getByText('Create New Asset')).toBeVisible();

    // Fill form
    await page.getByLabel(/symbol/i).fill('BTCUSD');
    await page.getByLabel(/name/i).fill('Bitcoin / US Dollar');
    await page.getByLabel(/description/i).fill('Cryptocurrency pair');

    // Submit form
    await page.getByRole('button', { name: /create asset/i }).click();

    // Check success toast
    await expect(page.locator('[data-sonner-toast]')).toContainText('Asset created successfully');

    // Check dialog closed
    await expect(page.getByText('Create New Asset')).not.toBeVisible();
  });

  test('should validate required fields when creating asset', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Click add asset button
    await page.getByRole('button', { name: /add asset/i }).click();

    // Try to submit empty form
    await page.getByRole('button', { name: /create asset/i }).click();

    // Check validation errors
    await expect(page.getByText('Symbol is required')).toBeVisible();
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
  });

  test('should validate symbol format', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Click add asset button
    await page.getByRole('button', { name: /add asset/i }).click();

    // Fill form with invalid symbol
    await page.getByLabel(/symbol/i).fill('eur/usd');
    await page.getByLabel(/name/i).fill('Euro / US Dollar');

    // Submit form
    await page.getByRole('button', { name: /create asset/i }).click();

    // Check validation error
    await expect(page.getByText('Symbol must contain only uppercase letters and numbers')).toBeVisible();
  });

  test('should convert symbol to uppercase automatically', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Click add asset button
    await page.getByRole('button', { name: /add asset/i }).click();

    // Type lowercase symbol
    const symbolInput = page.getByLabel(/symbol/i);
    await symbolInput.fill('btcusd');

    // Check it's converted to uppercase
    await expect(symbolInput).toHaveValue('BTCUSD');
  });

  test('should handle duplicate symbol error', async ({ page }) => {
    // Mock duplicate symbol error
    await page.route('**/rest/v1/assets*', async (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            code: '23505',
            message: 'duplicate key value violates unique constraint'
          })
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/dashboard/assets');

    // Click add asset button
    await page.getByRole('button', { name: /add asset/i }).click();

    // Fill form with duplicate symbol
    await page.getByLabel(/symbol/i).fill('EURUSD');
    await page.getByLabel(/name/i).fill('Euro / US Dollar');

    // Submit form
    await page.getByRole('button', { name: /create asset/i }).click();

    // Check error toast
    await expect(page.locator('[data-sonner-toast]')).toContainText('An asset with this symbol already exists');
  });

  test('should edit asset successfully', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Wait for assets to load
    await expect(page.getByText('EURUSD')).toBeVisible();

    // Click action menu on first asset
    const actionButtons = page.locator('[aria-label="Open menu"]');
    await actionButtons.first().click();

    // Click edit
    await page.getByText('Edit').click();

    // Check edit dialog opened
    await expect(page.getByText('Edit Asset')).toBeVisible();

    // Update name
    const nameInput = page.getByDisplayValue('Euro / US Dollar');
    await nameInput.clear();
    await nameInput.fill('Updated Euro / US Dollar');

    // Submit form
    await page.getByRole('button', { name: /update asset/i }).click();

    // Check success toast
    await expect(page.locator('[data-sonner-toast]')).toContainText('Asset updated successfully');

    // Check dialog closed
    await expect(page.getByText('Edit Asset')).not.toBeVisible();
  });

  test('should delete asset successfully', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Wait for assets to load
    await expect(page.getByText('EURUSD')).toBeVisible();

    // Click action menu on first asset
    const actionButtons = page.locator('[aria-label="Open menu"]');
    await actionButtons.first().click();

    // Click delete
    await page.getByText('Delete').click();

    // Check confirmation dialog
    await expect(page.getByText('Delete Asset')).toBeVisible();
    await expect(page.getByText('Are you sure you want to delete "EURUSD"?')).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: /continue/i }).click();

    // Check success toast
    await expect(page.locator('[data-sonner-toast]')).toContainText('Asset deleted successfully');
  });

  test('should cancel asset deletion', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Wait for assets to load
    await expect(page.getByText('EURUSD')).toBeVisible();

    // Click action menu on first asset
    const actionButtons = page.locator('[aria-label="Open menu"]');
    await actionButtons.first().click();

    // Click delete
    await page.getByText('Delete').click();

    // Check confirmation dialog
    await expect(page.getByText('Delete Asset')).toBeVisible();

    // Cancel deletion
    await page.getByRole('button', { name: /cancel/i }).click();

    // Check dialog closed and asset still exists
    await expect(page.getByText('Delete Asset')).not.toBeVisible();
    await expect(page.getByText('EURUSD')).toBeVisible();
  });

  test('should show empty state when no assets exist', async ({ page }) => {
    // Mock empty assets response
    await page.route('**/rest/v1/assets*', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'content-range': '0-0/0' },
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/dashboard/assets');

    // Check empty state
    await expect(page.getByText('No results.')).toBeVisible();
    await expect(page.getByRole('button', { name: /add asset/i })).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/rest/v1/assets*', (route) => {
      if (route.request().method() === 'GET') {
        route.abort('failed');
      }
    });

    await page.goto('/dashboard/assets');

    // Should show error toast
    await expect(page.locator('[data-sonner-toast]')).toContainText('An unexpected error occurred');
  });

  test('should show loading state during form submission', async ({ page }) => {
    await page.goto('/dashboard/assets');

    // Click add asset button
    await page.getByRole('button', { name: /add asset/i }).click();

    // Mock slow create response
    await page.route('**/rest/v1/assets*', async (route) => {
      if (route.request().method() === 'POST') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: '3',
            user_id: 'mock-user-id',
            symbol: 'BTCUSD',
            name: 'Bitcoin / US Dollar',
            created_at: new Date().toISOString()
          }])
        });
      }
    });

    // Fill form
    await page.getByLabel(/symbol/i).fill('BTCUSD');
    await page.getByLabel(/name/i).fill('Bitcoin / US Dollar');

    // Submit form
    await page.getByRole('button', { name: /create asset/i }).click();

    // Check loading state
    await expect(page.getByRole('button', { name: /saving/i })).toBeVisible();
    await expect(page.getByLabel(/symbol/i)).toBeDisabled();
    await expect(page.getByLabel(/name/i)).toBeDisabled();
  });

  test('should support data table filtering and pagination', async ({ page }) => {
    // Mock larger dataset
    await page.route('**/rest/v1/assets*', (route) => {
      if (route.request().method() === 'GET') {
        const assets = Array.from({ length: 15 }, (_, i) => ({
          id: String(i + 1),
          user_id: 'mock-user-id',
          symbol: `PAIR${i + 1}`,
          name: `Trading Pair ${i + 1}`,
          description: `Description for pair ${i + 1}`,
          created_at: new Date(2023, 0, i + 1).toISOString()
        }));

        route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: { 'content-range': '0-14/15' },
          body: JSON.stringify(assets)
        });
      }
    });

    await page.goto('/dashboard/assets');

    // Wait for data to load
    await expect(page.getByText('PAIR1')).toBeVisible();

    // Check pagination controls are visible (assuming they appear with more than 10 items)
    await expect(page.locator('[aria-label="Go to next page"]')).toBeVisible();

    // Test search functionality (if implemented in DataTableToolbar)
    const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="filter" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('PAIR1');
      // Should filter results
      await expect(page.getByText('PAIR1')).toBeVisible();
      await expect(page.getByText('PAIR2')).not.toBeVisible();
    }
  });
});