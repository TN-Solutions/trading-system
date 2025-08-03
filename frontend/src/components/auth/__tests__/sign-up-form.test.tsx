import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignUpForm } from '../sign-up-form'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Mock dependencies
jest.mock('@/lib/supabase/client')
jest.mock('sonner')

const mockSupabase = {
  auth: {
    signUp: jest.fn(),
  },
}

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockToast = toast as jest.Mocked<typeof toast>

// Mock window.location
delete (window as any).location
window.location = { ...window.location, href: '', origin: 'http://localhost:3000' }

// Mock setTimeout
jest.useFakeTimers()

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateClient.mockReturnValue(mockSupabase as any)
    mockToast.error = jest.fn()
    mockToast.success = jest.fn()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
  })

  it('renders sign-up form with all required fields', () => {
    render(<SignUpForm />)
    
    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByText('Enter your details to get started')).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation errors for invalid email', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('shows validation errors for short password', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, '12345')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'differentpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
    })
  })

  it('submits form with valid credentials and shows success message', async () => {
    const user = userEvent.setup()
    mockSupabase.auth.signUp.mockResolvedValue({ error: null })
    
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback'
        }
      })
    })
    
    expect(mockToast.success).toHaveBeenCalledWith('Check your email for the confirmation link!')
  })

  it('redirects to sign-in page after successful signup', async () => {
    const user = userEvent.setup()
    mockSupabase.auth.signUp.mockResolvedValue({ error: null })
    
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalled()
    })
    
    // Fast-forward the setTimeout
    jest.advanceTimersByTime(2000)
    
    expect(window.location.href).toBe('/auth/sign-in')
  })

  it('handles sign-up error and shows error message', async () => {
    const user = userEvent.setup()
    const errorMessage = 'User already registered'
    mockSupabase.auth.signUp.mockResolvedValue({ 
      error: { message: errorMessage } 
    })
    
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('shows loading state during sign-up process', async () => {
    const user = userEvent.setup()
    let resolveSignUp: (value: any) => void
    const signUpPromise = new Promise((resolve) => {
      resolveSignUp = resolve
    })
    mockSupabase.auth.signUp.mockReturnValue(signUpPromise)
    
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    expect(screen.getByText('Creating account...')).toBeInTheDocument()
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(confirmPasswordInput).toBeDisabled()
    expect(submitButton).toBeDisabled()
    
    // Resolve the promise to end loading state
    resolveSignUp!({ error: null })
    
    await waitFor(() => {
      expect(screen.getByText('Create account')).toBeInTheDocument()
    })
  })

  it('handles unexpected errors gracefully', async () => {
    const user = userEvent.setup()
    mockSupabase.auth.signUp.mockRejectedValue(new Error('Network error'))
    
    render(<SignUpForm />)
    
    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('An unexpected error occurred. Please try again.')
    })
  })
})