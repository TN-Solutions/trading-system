import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../auth-provider'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

// Mock dependencies
jest.mock('@/lib/supabase/client')

const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signOut: jest.fn(),
  },
}

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Test component that uses the auth hook
function TestComponent() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <div data-testid="user-state">
        {user ? `User: ${user.email}` : 'No user'}
      </div>
      <button onClick={signOut} data-testid="sign-out-btn">
        Sign Out
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  let mockSubscription: { unsubscribe: jest.Mock }
  
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateClient.mockReturnValue(mockSupabase as any)
    
    mockSubscription = { unsubscribe: jest.fn() }
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: mockSubscription }
    })
  })

  it('provides initial loading state', () => {
    mockSupabase.auth.getSession.mockReturnValue(
      Promise.resolve({ data: { session: null } })
    )
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('provides user data when session exists', async () => {
    const mockUser: Partial<User> = {
      id: '123',
      email: 'test@example.com',
    }
    
    const mockSession = {
      user: mockUser,
      access_token: 'token',
    }
    
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession }
    })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('User: test@example.com')
    })
  })

  it('provides null user when no session exists', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null }
    })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('No user')
    })
  })

  it('handles auth state changes', async () => {
    let onAuthStateChangeCallback: (event: string, session: any) => void
    
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null }
    })
    
    mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
      onAuthStateChangeCallback = callback
      return { data: { subscription: mockSubscription } }
    })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    // Initial state - no user
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('No user')
    })
    
    // Simulate sign in
    const mockUser: Partial<User> = {
      id: '123',
      email: 'test@example.com',
    }
    
    const mockSession = {
      user: mockUser,
      access_token: 'token',
    }
    
    act(() => {
      onAuthStateChangeCallback!('SIGNED_IN', mockSession)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('User: test@example.com')
    })
    
    // Simulate sign out
    act(() => {
      onAuthStateChangeCallback!('SIGNED_OUT', null)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('No user')
    })
  })

  it('calls signOut when signOut function is called', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null }
    })
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('sign-out-btn')).toBeInTheDocument()
    })
    
    const signOutBtn = screen.getByTestId('sign-out-btn')
    
    await act(async () => {
      signOutBtn.click()
    })
    
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('cleans up subscription on unmount', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null }
    })
    
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toBeInTheDocument()
    })
    
    unmount()
    
    expect(mockSubscription.unsubscribe).toHaveBeenCalled()
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    console.error = originalError
  })
})