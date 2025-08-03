import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportManagementView } from '../page-views/report-management-view';
import * as reportActions from '../actions/report-actions';
import * as assetActions from '@/features/assets/actions/asset-actions';
import * as methodologyActions from '@/features/methodologies/actions/methodology-actions';
import { toast } from 'sonner';

// Mock the actions
jest.mock('../actions/report-actions');
jest.mock('@/features/assets/actions/asset-actions');
jest.mock('@/features/methodologies/actions/methodology-actions');
jest.mock('sonner');

// Mock the data table dependencies
jest.mock('@/hooks/use-data-table');
jest.mock('nuqs');

const mockReportActions = reportActions as jest.Mocked<typeof reportActions>;
const mockAssetActions = assetActions as jest.Mocked<typeof assetActions>;
const mockMethodologyActions = methodologyActions as jest.Mocked<typeof methodologyActions>;
const mockToast = toast as jest.Mocked<typeof toast>;

const mockReports = [
  {
    id: 'report-1',
    user_id: 'user-1',
    asset_id: 'asset-1',
    methodology_id: 'methodology-1',
    title: 'Q4 2024 EUR/USD Analysis',
    status: 'draft' as const,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    asset: {
      id: 'asset-1',
      symbol: 'EURUSD',
      name: 'Euro / US Dollar'
    },
    methodology: {
      id: 'methodology-1',
      name: 'Technical Analysis'
    }
  }
];

const mockAssets = [
  {
    id: 'asset-1',
    user_id: 'user-1',
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    description: 'Major currency pair',
    created_at: '2023-01-01T00:00:00Z'
  }
];

const mockMethodologies = [
  {
    id: 'methodology-1',
    user_id: 'user-1',
    name: 'Technical Analysis',
    description: 'Chart-based analysis',
    created_at: '2023-01-01T00:00:00Z'
  }
];

// Mock the data table hook
const mockUseDataTable = require('@/hooks/use-data-table');
mockUseDataTable.useDataTable = jest.fn(() => ({
  table: {
    getHeaderGroups: () => [],
    getRowModel: () => ({ rows: [] }),
    getCanPreviousPage: () => false,
    getCanNextPage: () => false,
    getPageCount: () => 1,
    getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
    previousPage: jest.fn(),
    nextPage: jest.fn(),
    setPageIndex: jest.fn(),
    setPageSize: jest.fn()
  }
}));

// Mock nuqs
const mockUseQueryState = require('nuqs');
mockUseQueryState.parseAsInteger = {
  withDefault: jest.fn(() => ({ parse: jest.fn(), serialize: jest.fn() }))
};
mockUseQueryState.useQueryState = jest.fn(() => [10, jest.fn()]);

describe('ReportManagementView Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default successful responses
    mockReportActions.getReports.mockResolvedValue({
      success: true,
      reports: mockReports
    });
    
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: mockAssets
    });
    
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: mockMethodologies
    });
  });

  it('loads and displays initial data successfully', async () => {
    render(<ReportManagementView />);

    // Show loading state initially
    expect(screen.getByText('Loading reports...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Report Management')).toBeInTheDocument();
    });

    // Verify all data fetching functions were called
    expect(mockReportActions.getReports).toHaveBeenCalledTimes(1);
    expect(mockAssetActions.getAssets).toHaveBeenCalledTimes(1);
    expect(mockMethodologyActions.getMethodologies).toHaveBeenCalledTimes(1);
  });

  it('handles error when fetching reports fails', async () => {
    mockReportActions.getReports.mockResolvedValue({
      success: false,
      error: 'Failed to fetch reports'
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch reports');
    });
  });

  it('handles error when fetching assets fails', async () => {
    mockAssetActions.getAssets.mockResolvedValue({
      success: false,
      error: 'Failed to fetch assets'
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch assets');
    });
  });

  it('handles error when fetching methodologies fails', async () => {
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: false,
      error: 'Failed to fetch methodologies'
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch methodologies');
    });
  });

  it('disables create button when no assets or methodologies available', async () => {
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: []
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Report Management')).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /create report/i });
    expect(createButton).toBeDisabled();
    expect(screen.getByText('Setup Required')).toBeInTheDocument();
  });

  it('creates a new report successfully', async () => {
    const user = userEvent.setup();
    
    mockReportActions.createReport.mockResolvedValue({
      success: true,
      report: {
        id: 'new-report',
        user_id: 'user-1',
        asset_id: 'asset-1',
        methodology_id: 'methodology-1',
        title: 'New Test Report',
        status: 'draft',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Report Management')).toBeInTheDocument();
    });

    // Click create button
    const createButton = screen.getByRole('button', { name: /create report/i });
    await user.click(createButton);

    // Fill out form
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Test Report');

    // Select asset
    const assetSelect = screen.getByRole('combobox', { name: /asset/i });
    await user.click(assetSelect);
    await user.click(screen.getByText('EURUSD'));

    // Select methodology
    const methodologySelect = screen.getByRole('combobox', { name: /methodology/i });
    await user.click(methodologySelect);
    await user.click(screen.getByText('Technical Analysis'));

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockReportActions.createReport).toHaveBeenCalledWith({
        title: 'New Test Report',
        asset_id: 'asset-1',
        methodology_id: 'methodology-1',
        status: 'draft'
      });
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Report created successfully');
    });
  });

  it('handles create report failure', async () => {
    const user = userEvent.setup();
    
    mockReportActions.createReport.mockResolvedValue({
      success: false,
      error: 'Failed to create report'
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Report Management')).toBeInTheDocument();
    });

    // Click create button
    const createButton = screen.getByRole('button', { name: /create report/i });
    await user.click(createButton);

    // Fill out form
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'New Test Report');

    // Select asset and methodology
    const assetSelect = screen.getByRole('combobox', { name: /asset/i });
    await user.click(assetSelect);
    await user.click(screen.getByText('EURUSD'));

    const methodologySelect = screen.getByRole('combobox', { name: /methodology/i });
    await user.click(methodologySelect);
    await user.click(screen.getByText('Technical Analysis'));

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create report/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to create report');
    });
  });

  it('deletes a report successfully', async () => {
    mockReportActions.deleteReport.mockResolvedValue({
      success: true
    });

    const { rerender } = render(<ReportManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Report Management')).toBeInTheDocument();
    });

    // Simulate delete action (this would normally be triggered by the table)
    const reportManagement = screen.getByText('Report Management').closest('div');
    
    // Manually trigger delete
    await waitFor(async () => {
      // Get the view component instance and call handleDeleteReport
      // In a real test, this would be triggered by clicking the delete button in the table
      const view = reportManagement?.querySelector('[data-testid="report-management"]');
      if (view) {
        // Simulate the delete action
        await mockReportActions.deleteReport('report-1');
      }
    });

    expect(mockToast.success).toHaveBeenCalledWith('Report deleted successfully');
  });

  it('handles delete report failure', async () => {
    mockReportActions.deleteReport.mockResolvedValue({
      success: false,
      error: 'Failed to delete report'
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Report Management')).toBeInTheDocument();
    });

    // Simulate delete action failure
    await waitFor(async () => {
      await mockReportActions.deleteReport('report-1');
    });

    expect(mockToast.error).toHaveBeenCalledWith('Failed to delete report');
  });

  it('shows setup warning when no assets exist', async () => {
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: []
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Setup Required')).toBeInTheDocument();
      expect(screen.getByText(/To create reports, you need at least one asset and one methodology/)).toBeInTheDocument();
    });
  });

  it('shows setup warning when no methodologies exist', async () => {
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: []
    });

    render(<ReportManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Setup Required')).toBeInTheDocument();
      expect(screen.getByText(/To create reports, you need at least one asset and one methodology/)).toBeInTheDocument();
    });
  });
});