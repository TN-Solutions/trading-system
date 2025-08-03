import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetForm } from '../asset-form';
import { Asset } from '@/types/asset';

const mockOnSubmit = jest.fn();

const mockAsset: Asset = {
  id: '1',
  user_id: 'user-1',
  symbol: 'EURUSD',
  name: 'Euro / US Dollar',
  description: 'Major currency pair',
  created_at: '2023-01-01T00:00:00Z'
};

describe('AssetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all required fields', () => {
    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Create Asset')).toBeInTheDocument();
    expect(screen.getByLabelText(/symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create asset/i })).toBeInTheDocument();
  });

  it('renders form with initial data for editing', () => {
    render(
      <AssetForm
        initialData={mockAsset}
        pageTitle="Edit Asset"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Edit Asset')).toBeInTheDocument();
    expect(screen.getByDisplayValue('EURUSD')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Euro / US Dollar')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Major currency pair')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update asset/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create asset/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Symbol is required')).toBeInTheDocument();
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid symbol format', async () => {
    const user = userEvent.setup();
    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
      />
    );

    const symbolInput = screen.getByLabelText(/symbol/i);
    const submitButton = screen.getByRole('button', { name: /create asset/i });

    await user.type(symbolInput, 'eur/usd');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Symbol must contain only uppercase letters and numbers')).toBeInTheDocument();
    });
  });

  it('converts symbol to uppercase automatically', async () => {
    const user = userEvent.setup();
    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
      />
    );

    const symbolInput = screen.getByLabelText(/symbol/i);
    await user.type(symbolInput, 'eurusd');

    expect(symbolInput).toHaveValue('EURUSD');
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
      />
    );

    const symbolInput = screen.getByLabelText(/symbol/i);
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create asset/i });

    await user.type(symbolInput, 'BTCUSD');
    await user.type(nameInput, 'Bitcoin / US Dollar');
    await user.type(descriptionInput, 'Cryptocurrency pair');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        symbol: 'BTCUSD',
        name: 'Bitcoin / US Dollar',
        description: 'Cryptocurrency pair'
      });
    });
  });

  it('resets form after successful creation', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
      />
    );

    const symbolInput = screen.getByLabelText(/symbol/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /create asset/i });

    await user.type(symbolInput, 'GBPUSD');
    await user.type(nameInput, 'British Pound / US Dollar');
    await user.click(submitButton);

    await waitFor(() => {
      expect(symbolInput).toHaveValue('');
      expect(nameInput).toHaveValue('');
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
        loading={true}
      />
    );

    const symbolInput = screen.getByLabelText(/symbol/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /saving/i });

    expect(symbolInput).toBeDisabled();
    expect(nameInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });

  it('shows reset button for edit mode', () => {
    render(
      <AssetForm
        initialData={mockAsset}
        pageTitle="Edit Asset"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AssetForm
        initialData={mockAsset}
        pageTitle="Edit Asset"
        onSubmit={mockOnSubmit}
      />
    );

    const symbolInput = screen.getByLabelText(/symbol/i);
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // Change the symbol value
    await user.clear(symbolInput);
    await user.type(symbolInput, 'CHANGED');
    expect(symbolInput).toHaveValue('CHANGED');

    // Reset form
    await user.click(resetButton);

    // Should revert to original value
    expect(symbolInput).toHaveValue('EURUSD');
  });

  it('validates description length', async () => {
    const user = userEvent.setup();
    render(
      <AssetForm
        pageTitle="Create Asset"
        onSubmit={mockOnSubmit}
      />
    );

    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create asset/i });

    // Type a description that's too long (>500 characters)
    const longDescription = 'a'.repeat(501);
    await user.type(descriptionInput, longDescription);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be less than 500 characters')).toBeInTheDocument();
    });
  });
});