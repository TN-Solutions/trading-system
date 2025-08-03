import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportForm } from '../report-form';
import { Report } from '@/types/report';
import { Asset } from '@/types/asset';
import { Methodology } from '@/types/methodology';

const mockOnSubmit = jest.fn();

const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    user_id: 'user-1',
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    description: 'Major currency pair',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'asset-2',
    user_id: 'user-1',
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    description: 'Cryptocurrency pair',
    created_at: '2023-01-01T00:00:00Z'
  }
];

const mockMethodologies: Methodology[] = [
  {
    id: 'methodology-1',
    user_id: 'user-1',
    name: 'Technical Analysis',
    description: 'Chart-based analysis',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'methodology-2',
    user_id: 'user-1',
    name: 'Fundamental Analysis',
    description: 'Economic-based analysis',
    created_at: '2023-01-01T00:00:00Z'
  }
];

const mockReport: Report = {
  id: 'report-1',
  user_id: 'user-1',
  asset_id: 'asset-1',
  methodology_id: 'methodology-1',
  title: 'Q4 2024 EUR/USD Analysis',
  status: 'draft',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
};

describe('ReportForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all required fields', () => {
    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    expect(screen.getByText('Create Report')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asset/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/methodology/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create report/i })).toBeInTheDocument();
  });

  it('renders form with initial data for editing', () => {
    render(
      <ReportForm
        initialData={mockReport}
        pageTitle="Edit Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    expect(screen.getByText('Edit Report')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Q4 2024 EUR/USD Analysis')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update report/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Asset is required')).toBeInTheDocument();
      expect(screen.getByText('Methodology is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for title that is too long', async () => {
    const user = userEvent.setup();
    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create report/i });

    // Type a title that's too long (>200 characters)
    const longTitle = 'a'.repeat(201);
    await user.type(titleInput, longTitle);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be less than 200 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create report/i });

    await user.type(titleInput, 'Test Report');
    
    // Open asset select and choose first asset
    const assetSelect = screen.getByRole('combobox', { name: /asset/i });
    await user.click(assetSelect);
    await user.click(screen.getByText('EURUSD'));

    // Open methodology select and choose first methodology
    const methodologySelect = screen.getByRole('combobox', { name: /methodology/i });
    await user.click(methodologySelect);
    await user.click(screen.getByText('Technical Analysis'));

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Report',
        asset_id: 'asset-1',
        methodology_id: 'methodology-1',
        status: 'draft'
      });
    });
  });

  it('resets form after successful creation', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create report/i });

    await user.type(titleInput, 'Test Report');
    
    // Select asset and methodology
    const assetSelect = screen.getByRole('combobox', { name: /asset/i });
    await user.click(assetSelect);
    await user.click(screen.getByText('EURUSD'));

    const methodologySelect = screen.getByRole('combobox', { name: /methodology/i });
    await user.click(methodologySelect);
    await user.click(screen.getByText('Technical Analysis'));

    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });

  it('shows loading state during submission', async () => {
    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        loading={true}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /saving/i });

    expect(titleInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });

  it('shows reset button for edit mode', () => {
    render(
      <ReportForm
        initialData={mockReport}
        pageTitle="Edit Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ReportForm
        initialData={mockReport}
        pageTitle="Edit Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // Change the title value
    await user.clear(titleInput);
    await user.type(titleInput, 'CHANGED TITLE');
    expect(titleInput).toHaveValue('CHANGED TITLE');

    // Reset form
    await user.click(resetButton);

    // Should revert to original value
    expect(titleInput).toHaveValue('Q4 2024 EUR/USD Analysis');
  });

  it('displays asset options with symbol and name', async () => {
    const user = userEvent.setup();
    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const assetSelect = screen.getByRole('combobox', { name: /asset/i });
    await user.click(assetSelect);

    expect(screen.getByText('EURUSD')).toBeInTheDocument();
    expect(screen.getByText('Euro / US Dollar')).toBeInTheDocument();
    expect(screen.getByText('BTCUSD')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin / US Dollar')).toBeInTheDocument();
  });

  it('allows changing status between draft and published', async () => {
    const user = userEvent.setup();
    render(
      <ReportForm
        pageTitle="Create Report"
        onSubmit={mockOnSubmit}
        assets={mockAssets}
        methodologies={mockMethodologies}
      />
    );

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    await user.click(statusSelect);

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();

    await user.click(screen.getByText('Published'));
    expect(statusSelect).toHaveTextContent('Published');
  });
});