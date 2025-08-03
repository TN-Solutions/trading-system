import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInForm } from '@/components/auth/sign-in-form'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { AuthProvider } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Mock dependencies
jest.mock('@/lib/supabase/client')
jest.mock('sonner')

const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
}

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockToast = toast as jest.Mocked<typeof toast>

// Mock window.location
delete (window as any).location
window.location = { ...window.location, href: '', origin: 'http://localhost:3000' }

// Mock setTimeout
jest.useFakeTimers()

describe('Auth Integration Tests', () => {
  let mockSubscription: { unsubscribe: jest.Mock }
  
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateClient.mockReturnValue(mockSupabase as any)
    mockToast.error = jest.fn()
    mockToast.success = jest.fn()
    
    mockSubscription = { unsubscribe: jest.fn() }
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: mockSubscription }
    })
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null }
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  describe('Complete Sign-up Flow', () => {
    it('allows user to complete sign-up process with valid data', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signUp.mockResolvedValue({ error: null })
      
      render(
        <AuthProvider>
          <SignUpForm />
        </AuthProvider>
      )
      
      // Fill out sign-up form
      const emailInput = screen.getByLabelText(/^email$/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      await user.type(emailInput, 'newuser@example.com')
      await user.type(passwordInput, 'securepassword123')
      await user.type(confirmPasswordInput, 'securepassword123')
      await user.click(submitButton)
      
      // Verify Supabase was called correctly
      await waitFor(() => {
        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'securepassword123',
          options: {
            emailRedirectTo: 'http://localhost:3000/auth/callback'
          }
        })
      })
      
      // Verify success message
      expect(mockToast.success).toHaveBeenCalledWith('Check your email for the confirmation link!')
      
      // Verify redirect happens after delay
      jest.advanceTimersByTime(2000)
      expect(window.location.href).toBe('/auth/sign-in')
    })

    it('prevents sign-up with mismatched passwords', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <SignUpForm />
        </AuthProvider>
      )
      
      const emailInput = screen.getByLabelText(/^email$/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      await user.type(emailInput, 'newuser@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'differentpassword')
      await user.click(submitButton)
      
      // Should show validation error, not call Supabase
      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
      })
      
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
    })
  })

  describe('Complete Sign-in Flow', () => {
    it('allows user to sign in with valid credentials', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null })
      
      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      )
      
      // Fill out sign-in form
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // Verify Supabase was called correctly
      await waitFor(() => {
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'password123'
        })
      })
      
      // Verify success message and redirect
      expect(mockToast.success).toHaveBeenCalledWith('Successfully signed in!')
      expect(window.location.href).toBe('/dashboard/overview')
    })

    it('handles invalid credentials gracefully', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Invalid login credentials'
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ 
        error: { message: errorMessage } 
      })
      
      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      )
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)
      
      // Verify error message is shown
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(errorMessage)
      })
      
      // Should not redirect on error
      expect(window.location.href).toBe('')
    })
  })

  describe('Authentication State Management', () => {
    it('properly manages loading states during authentication', async () => {
      const user = userEvent.setup()
      
      // Create a promise that we can control
      let resolveSignIn: (value: any) => void
      const signInPromise = new Promise((resolve) => {
        resolveSignIn = resolve
      })
      mockSupabase.auth.signInWithPassword.mockReturnValue(signInPromise)
      
      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      )
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // Should show loading state
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      
      // Resolve the sign-in
      resolveSignIn!({ error: null })
      
      // Loading state should end
      await waitFor(() => {
        expect(screen.queryByText('Signing in...')).not.toBeInTheDocument()
        expect(screen.getByText('Sign in')).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation Integration', () => {
    it('validates all required fields before submission', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      )
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      // Try to submit without filling fields
      await user.click(submitButton)
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
      })
      
      // Should not call Supabase
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('validates email format correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      )
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'invalid-email')
      await user.type(passwordInput, 'validpassword123')
      await user.click(submitButton)
      
      // Should show email validation error
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      })
      
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling Integration', () => {
    it('handles network errors gracefully', async () => {
      const user = userEvent.setup()
      mockSupabase.auth.signInWithPassword.mockRejectedValue(new Error('Network error'))
      
      render(
        <AuthProvider>
          <SignInForm />
        </AuthProvider>
      )
      
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // Should show generic error message
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again.')
      })
    })
  })
})