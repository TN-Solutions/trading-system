import { test, expect } from '@playwright/test';

test.describe('Report Management', () => {
  test.beforeEach(async ({ page }) => {
    // Assume user is already authenticated
    // In a real scenario, you'd handle authentication first
    await page.goto('/dashboard/reports');
  });

  test('displays report management page correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Report Management' })).toBeVisible();
    await expect(page.getByText('Create and manage your trading analysis reports.')).toBeVisible();
    await expect(page.getByRole('button', { name: /create report/i })).toBeVisible();
  });

  test('shows setup warning when no assets or methodologies exist', async ({ page }) => {
    // Mock empty responses for assets and methodologies
    await page.route('**/api/assets', async route => {
      await route.fulfill({
        json: { success: true, assets: [] }
      });
    });

    await page.route('**/api/methodologies', async route => {
      await route.fulfill({
        json: { success: true, methodologies: [] }
      });
    });

    await page.reload();

    await expect(page.getByText('Setup Required')).toBeVisible();
    await expect(page.getByText(/To create reports, you need at least one asset and one methodology/)).toBeVisible();
    await expect(page.getByRole('button', { name: /create report/i })).toBeDisabled();
  });

  test('creates a new report successfully', async ({ page }) => {
    // Mock successful responses
    await page.route('**/api/assets', async route => {
      await route.fulfill({
        json: {
          success: true,
          assets: [
            {
              id: 'asset-1',
              symbol: 'EURUSD',
              name: 'Euro / US Dollar',
              description: 'Major currency pair'
            }
          ]
        }
      });
    });

    await page.route('**/api/methodologies', async route => {
      await route.fulfill({
        json: {
          success: true,
          methodologies: [
            {
              id: 'methodology-1',
              name: 'Technical Analysis',
              description: 'Chart-based analysis'
            }
          ]
        }
      });
    });

    await page.route('**/api/reports', async (route, request) => {
      if (request.method() === 'POST') {
        await route.fulfill({
          json: {
            success: true,
            report: {
              id: 'new-report-1',
              title: 'Test Report',
              asset_id: 'asset-1',
              methodology_id: 'methodology-1',
              status: 'draft'
            }
          }
        });
      } else {
        await route.fulfill({
          json: { success: true, reports: [] }
        });
      }
    });

    await page.reload();

    // Click create report button
    await page.getByRole('button', { name: /create report/i }).click();

    // Fill out the form
    await page.getByLabel(/title/i).fill('Test Report');
    
    // Select asset
    await page.getByRole('combobox', { name: /asset/i }).click();
    await page.getByText('EURUSD').click();
    
    // Select methodology
    await page.getByRole('combobox', { name: /methodology/i }).click();
    await page.getByText('Technical Analysis').click();

    // Submit the form
    await page.getByRole('button', { name: /create report/i }).last().click();

    // Verify success message
    await expect(page.getByText('Report created successfully')).toBeVisible();
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('validates form inputs correctly', async ({ page }) => {
    // Mock required data
    await page.route('**/api/assets', async route => {
      await route.fulfill({
        json: {
          success: true,
          assets: [{ id: 'asset-1', symbol: 'EURUSD', name: 'Euro / US Dollar' }]
        }
      });
    });

    await page.route('**/api/methodologies', async route => {
      await route.fulfill({
        json: {
          success: true,
          methodologies: [{ id: 'methodology-1', name: 'Technical Analysis' }]
        }
      });
    });

    await page.reload();

    // Click create report button
    await page.getByRole('button', { name: /create report/i }).click();

    // Try to submit without filling required fields
    await page.getByRole('button', { name: /create report/i }).last().click();

    // Check for validation errors
    await expect(page.getByText('Title is required')).toBeVisible();
    await expect(page.getByText('Asset is required')).toBeVisible();
    await expect(page.getByText('Methodology is required')).toBeVisible();
  });

  test('filters and searches reports correctly', async ({ page }) => {
    // Mock reports data
    const mockReports = [
      {
        id: 'report-1',
        title: 'EUR/USD Technical Analysis',
        status: 'draft',
        asset: { symbol: 'EURUSD', name: 'Euro / US Dollar' },
        methodology: { name: 'Technical Analysis' },
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 'report-2',
        title: 'BTC/USD Fundamental Analysis',
        status: 'published',
        asset: { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar' },
        methodology: { name: 'Fundamental Analysis' },
        created_at: '2023-01-02T00:00:00Z'
      }
    ];

    await page.route('**/api/reports', async route => {
      await route.fulfill({
        json: { success: true, reports: mockReports }
      });
    });

    await page.reload();

    // Verify both reports are displayed
    await expect(page.getByText('EUR/USD Technical Analysis')).toBeVisible();
    await expect(page.getByText('BTC/USD Fundamental Analysis')).toBeVisible();

    // Test search functionality
    await page.getByPlaceholder(/search/i).fill('EUR');
    await expect(page.getByText('EUR/USD Technical Analysis')).toBeVisible();
    await expect(page.getByText('BTC/USD Fundamental Analysis')).not.toBeVisible();

    // Clear search
    await page.getByPlaceholder(/search/i).clear();
    await expect(page.getByText('BTC/USD Fundamental Analysis')).toBeVisible();
  });

  test('deletes a report with confirmation', async ({ page }) => {
    // Mock reports data
    const mockReports = [
      {
        id: 'report-1',
        title: 'Test Report to Delete',
        status: 'draft',
        asset: { symbol: 'EURUSD', name: 'Euro / US Dollar' },
        methodology: { name: 'Technical Analysis' },
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    await page.route('**/api/reports', async (route, request) => {
      if (request.method() === 'DELETE') {
        await route.fulfill({
          json: { success: true }
        });
      } else {
        await route.fulfill({
          json: { success: true, reports: mockReports }
        });
      }
    });

    await page.reload();

    // Click the actions menu for the report
    await page.getByRole('button', { name: /open menu/i }).first().click();
    
    // Click delete option
    await page.getByText('Delete').click();

    // Confirm deletion in the alert modal
    await expect(page.getByText(/are you sure/i)).toBeVisible();
    await page.getByRole('button', { name: /continue/i }).click();

    // Verify success message
    await expect(page.getByText('Report deleted successfully')).toBeVisible();
  });

  test('edits a report successfully', async ({ page }) => {
    // Mock reports data
    const mockReports = [
      {
        id: 'report-1',
        title: 'Original Report Title',
        status: 'draft',
        asset_id: 'asset-1',
        methodology_id: 'methodology-1',
        asset: { id: 'asset-1', symbol: 'EURUSD', name: 'Euro / US Dollar' },
        methodology: { id: 'methodology-1', name: 'Technical Analysis' },
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    await page.route('**/api/reports', async (route, request) => {
      if (request.method() === 'PUT') {
        await route.fulfill({
          json: {
            success: true,
            report: {
              ...mockReports[0],
              title: 'Updated Report Title'
            }
          }
        });
      } else {
        await route.fulfill({
          json: { success: true, reports: mockReports }
        });
      }
    });

    await page.route('**/api/assets', async route => {
      await route.fulfill({
        json: {
          success: true,
          assets: [{ id: 'asset-1', symbol: 'EURUSD', name: 'Euro / US Dollar' }]
        }
      });
    });

    await page.route('**/api/methodologies', async route => {
      await route.fulfill({
        json: {
          success: true,
          methodologies: [{ id: 'methodology-1', name: 'Technical Analysis' }]
        }
      });
    });

    await page.reload();

    // Click the actions menu for the report
    await page.getByRole('button', { name: /open menu/i }).first().click();
    
    // Click edit option
    await page.getByText('Edit').click();

    // Verify form is populated with existing data
    await expect(page.getByDisplayValue('Original Report Title')).toBeVisible();

    // Update the title
    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Updated Report Title');

    // Submit the form
    await page.getByRole('button', { name: /update report/i }).click();

    // Verify success message
    await expect(page.getByText('Report updated successfully')).toBeVisible();
    
    // Verify dialog is closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('displays correct status badges', async ({ page }) => {
    // Mock reports with different statuses
    const mockReports = [
      {
        id: 'report-1',
        title: 'Draft Report',
        status: 'draft',
        asset: { symbol: 'EURUSD', name: 'Euro / US Dollar' },
        methodology: { name: 'Technical Analysis' },
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 'report-2',
        title: 'Published Report',
        status: 'published',
        asset: { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar' },
        methodology: { name: 'Fundamental Analysis' },
        created_at: '2023-01-02T00:00:00Z'
      }
    ];

    await page.route('**/api/reports', async route => {
      await route.fulfill({
        json: { success: true, reports: mockReports }
      });
    });

    await page.reload();

    // Verify status badges are displayed correctly
    await expect(page.getByText('Draft').first()).toBeVisible();
    await expect(page.getByText('Published').first()).toBeVisible();
    
    // Verify draft has yellow styling and published has green styling
    const draftBadge = page.getByText('Draft').first();
    const publishedBadge = page.getByText('Published').first();
    
    await expect(draftBadge).toHaveClass(/yellow/);
    await expect(publishedBadge).toHaveClass(/green/);
  });
});