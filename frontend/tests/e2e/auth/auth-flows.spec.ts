import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase responses for E2E tests
    await page.route('**/auth/v1/**', (route) => {
      const url = route.request().url()
      
      if (url.includes('/token')) {
        // Mock sign-in success
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-access-token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'mock-refresh-token',
            user: {
              id: 'mock-user-id',
              email: 'test@example.com',
              email_confirmed_at: new Date().toISOString(),
            }
          })
        })
      } else if (url.includes('/signup')) {
        // Mock sign-up success
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 'mock-user-id',
              email: 'test@example.com',
              email_confirmed_at: null,
            },
            session: null
          })
        })
      } else {
        route.continue()
      }
    })
  })

  test.describe('Sign In Flow', () => {
    test('should display sign-in form correctly', async ({ page }) => {
      await page.goto('/auth/sign-in')
      
      // Check form elements
      await expect(page.getByText('Welcome back')).toBeVisible()
      await expect(page.getByText('Enter your credentials to access your account')).toBeVisible()
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.goto('/auth/sign-in')
      
      // Try to submit empty form
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Check for validation errors
      await expect(page.getByText('Please enter a valid email address')).toBeVisible()
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/auth/sign-in')
      
      // Enter invalid email
      await page.getByLabel('Email').fill('invalid-email')
      await page.getByLabel('Password').fill('validpassword123')
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Check for email validation error
      await expect(page.getByText('Please enter a valid email address')).toBeVisible()
    })

    test('should validate password length', async ({ page }) => {
      await page.goto('/auth/sign-in')
      
      // Enter short password
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password').fill('12345')
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Check for password validation error
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible()
    })

    test('should show loading state during sign-in', async ({ page }) => {
      await page.goto('/auth/sign-in')
      
      // Fill form with valid data
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password').fill('password123')
      
      // Mock slow response
      await page.route('**/auth/v1/token**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-token',
            user: { id: '123', email: 'test@example.com' }
          })
        })
      })
      
      // Submit form
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Check loading state
      await expect(page.getByText('Signing in...')).toBeVisible()
      await expect(page.getByLabel('Email')).toBeDisabled()
      await expect(page.getByLabel('Password')).toBeDisabled()
      await expect(page.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
    })

    test('should handle sign-in error', async ({ page }) => {
      await page.goto('/auth/sign-in')
      
      // Mock error response
      await page.route('**/auth/v1/token**', (route) => {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'invalid_grant',
            error_description: 'Invalid login credentials'
          })
        })
      })
      
      // Fill and submit form
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password').fill('wrongpassword')
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Should show error toast (you may need to adjust selector based on your toast library)
      await expect(page.locator('[data-sonner-toast]')).toContainText('Invalid login credentials')
    })
  })

  test.describe('Sign Up Flow', () => {
    test('should display sign-up form correctly', async ({ page }) => {
      await page.goto('/auth/sign-up')
      
      // Check form elements
      await expect(page.getByText('Create an account')).toBeVisible()
      await expect(page.getByText('Enter your details to get started')).toBeVisible()
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
      await expect(page.getByLabel('Confirm Password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
    })

    test('should validate password confirmation', async ({ page }) => {
      await page.goto('/auth/sign-up')
      
      // Fill form with mismatched passwords
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password', { exact: true }).fill('password123')
      await page.getByLabel('Confirm Password').fill('differentpassword')
      await page.getByRole('button', { name: 'Create account' }).click()
      
      // Check for password mismatch error
      await expect(page.getByText("Passwords don't match")).toBeVisible()
    })

    test('should show loading state during sign-up', async ({ page }) => {
      await page.goto('/auth/sign-up')
      
      // Fill form with valid data
      await page.getByLabel('Email').fill('newuser@example.com')
      await page.getByLabel('Password', { exact: true }).fill('password123')
      await page.getByLabel('Confirm Password').fill('password123')
      
      // Submit form
      await page.getByRole('button', { name: 'Create account' }).click()
      
      // Check loading state
      await expect(page.getByText('Creating account...')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Creating account...' })).toBeDisabled()
    })
  })

  test.describe('Protected Route Access', () => {
    test('should redirect unauthenticated users to sign-in', async ({ page }) => {
      // Try to access protected route
      await page.goto('/dashboard/overview')
      
      // Should be redirected to sign-in
      await expect(page).toHaveURL(/\/auth\/sign-in/)
    })

    test('should allow authenticated users to access protected routes', async ({ page }) => {
      // Mock authenticated session
      await page.goto('/auth/sign-in')
      
      // Mock successful authentication
      await page.route('**/auth/v1/token**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-access-token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'mock-refresh-token',
            user: {
              id: 'mock-user-id',
              email: 'test@example.com',
              email_confirmed_at: new Date().toISOString(),
            }
          })
        })
      })
      
      // Sign in
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Password').fill('password123')
      await page.getByRole('button', { name: 'Sign in' }).click()
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/)
    })
  })

  test.describe('Session Persistence', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Set up authenticated session in browser storage
      await page.goto('/')
      
      await page.evaluate(() => {
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_at: Date.now() + 3600000,
          user: {
            id: 'mock-user-id',
            email: 'test@example.com'
          }
        }
        localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession))
      })
      
      // Mock session validation
      await page.route('**/auth/v1/user**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'mock-user-id',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString(),
          })
        })
      })
      
      // Refresh page
      await page.reload()
      
      // Try to access protected route
      await page.goto('/dashboard/overview')
      
      // Should remain on dashboard (not redirected to sign-in)
      await expect(page).toHaveURL(/\/dashboard/)
    })
  })

  test.describe('Logout Flow', () => {
    test('should sign out user and redirect to home', async ({ page }) => {
      // Set up authenticated session
      await page.goto('/')
      
      await page.evaluate(() => {
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_at: Date.now() + 3600000,
          user: {
            id: 'mock-user-id',
            email: 'test@example.com'
          }
        }
        localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession))
      })
      
      // Mock logout endpoint
      await page.route('**/auth/v1/logout**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({})
        })
      })
      
      // Go to dashboard
      await page.goto('/dashboard/overview')
      
      // Find and click logout button (adjust selector based on your UI)
      await page.getByRole('button', { name: /sign out|logout/i }).click()
      
      // Should be redirected to home or sign-in
      await expect(page).toHaveURL(/\/(auth\/sign-in)?$/)
    })
  })
})