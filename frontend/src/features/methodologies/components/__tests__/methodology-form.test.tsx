import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MethodologyForm } from '../methodology-form';
import { Methodology } from '@/types/methodology';

const mockOnSubmit = jest.fn();

const mockMethodology: Methodology = {
  id: '1',
  user_id: 'user-1',
  name: 'ICT',
  description: 'Inner Circle Trader methodology',
  created_at: '2023-01-01T00:00:00Z'
};

describe('MethodologyForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all required fields', () => {
    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create methodology/i })).toBeInTheDocument();
  });

  it('renders form with initial data for editing', () => {
    render(
      <MethodologyForm
        initialData={mockMethodology}
        pageTitle="Edit Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Edit Methodology')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ICT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Inner Circle Trader methodology')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update methodology/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create methodology/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid name format', async () => {
    const user = userEvent.setup();
    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /create methodology/i });

    await user.type(nameInput, 'Invalid@Name$');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must contain only letters, numbers, spaces, and basic punctuation')).toBeInTheDocument();
    });
  });

  it('validates name length', async () => {
    const user = userEvent.setup();
    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /create methodology/i });

    // Test too long name (>50 characters)
    const longName = 'a'.repeat(51);
    await user.type(nameInput, longName);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be less than 50 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create methodology/i });

    await user.type(nameInput, 'Smart Money Concepts');
    await user.type(descriptionInput, 'Advanced price action methodology');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Smart Money Concepts',
        description: 'Advanced price action methodology'
      });
    });
  });

  it('resets form after successful creation', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create methodology/i });

    await user.type(nameInput, 'Elliott Wave');
    await user.type(descriptionInput, 'Wave analysis methodology');
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('shows loading state during submission', async () => {
    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
        loading={true}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /saving/i });

    expect(nameInput).toBeDisabled();
    expect(descriptionInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });

  it('shows reset button for edit mode', () => {
    render(
      <MethodologyForm
        initialData={mockMethodology}
        pageTitle="Edit Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MethodologyForm
        initialData={mockMethodology}
        pageTitle="Edit Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // Change the name value
    await user.clear(nameInput);
    await user.type(nameInput, 'CHANGED');
    expect(nameInput).toHaveValue('CHANGED');

    // Reset form
    await user.click(resetButton);

    // Should revert to original value
    expect(nameInput).toHaveValue('ICT');
  });

  it('validates description length', async () => {
    const user = userEvent.setup();
    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create methodology/i });

    // Type a description that's too long (>500 characters)
    const longDescription = 'a'.repeat(501);
    await user.type(descriptionInput, longDescription);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be less than 500 characters')).toBeInTheDocument();
    });
  });

  it('allows empty description', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <MethodologyForm
        pageTitle="Create Methodology"
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /create methodology/i });

    await user.type(nameInput, 'Fibonacci');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Fibonacci',
        description: ''
      });
    });
  });
});