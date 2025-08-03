import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetManagementView } from '../page-views/asset-management-view';
import * as assetActions from '../actions/asset-actions';
import { Asset } from '@/types/asset';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('../actions/asset-actions');
jest.mock('sonner');

const mockAssetActions = assetActions as jest.Mocked<typeof assetActions>;
const mockToast = toast as jest.Mocked<typeof toast>;

const mockAssets: Asset[] = [
  {
    id: '1',
    user_id: 'user-1',
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    description: 'Major currency pair',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user-1',
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    description: null,
    created_at: '2023-01-02T00:00:00Z'
  }
];

describe('AssetManagementView Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
  });

  it('loads and displays assets on mount', async () => {
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: mockAssets
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
      expect(screen.getByText('GBPUSD')).toBeInTheDocument();
      expect(screen.getByText('Euro / US Dollar')).toBeInTheDocument();
    });

    expect(mockAssetActions.getAssets).toHaveBeenCalledTimes(1);
  });

  it('shows loading state while fetching assets', () => {
    mockAssetActions.getAssets.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<AssetManagementView />);

    expect(screen.getByText('Loading assets...')).toBeInTheDocument();
  });

  it('shows error message when fetching assets fails', async () => {
    mockAssetActions.getAssets.mockResolvedValue({
      success: false,
      error: 'Failed to fetch assets'
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch assets');
    });
  });

  it('opens create asset dialog when add button is clicked', async () => {
    const user = userEvent.setup();
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: []
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Asset Management')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add asset/i });
    await user.click(addButton);

    expect(screen.getByText('Create New Asset')).toBeInTheDocument();
  });

  it('creates new asset successfully', async () => {
    const user = userEvent.setup();
    const newAsset: Asset = {
      id: '3',
      user_id: 'user-1',
      symbol: 'BTCUSD',
      name: 'Bitcoin / US Dollar',
      description: 'Cryptocurrency pair',
      created_at: '2023-01-03T00:00:00Z'
    };

    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: mockAssets
    });

    mockAssetActions.createAsset.mockResolvedValue({
      success: true,
      asset: newAsset
    });

    render(<AssetManagementView />);

    // Wait for assets to load
    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
    });

    // Open create dialog
    const addButton = screen.getByRole('button', { name: /add asset/i });
    await user.click(addButton);

    // Fill form
    const symbolInput = screen.getByLabelText(/symbol/i);
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const createButton = screen.getByRole('button', { name: /create asset/i });

    await user.type(symbolInput, 'BTCUSD');
    await user.type(nameInput, 'Bitcoin / US Dollar');
    await user.type(descriptionInput, 'Cryptocurrency pair');
    await user.click(createButton);

    await waitFor(() => {
      expect(mockAssetActions.createAsset).toHaveBeenCalledWith({
        symbol: 'BTCUSD',
        name: 'Bitcoin / US Dollar',
        description: 'Cryptocurrency pair'
      });
      expect(mockToast.success).toHaveBeenCalledWith('Asset created successfully');
    });
  });

  it('shows error when asset creation fails', async () => {
    const user = userEvent.setup();
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: []
    });

    mockAssetActions.createAsset.mockResolvedValue({
      success: false,
      error: 'An asset with this symbol already exists for your account'
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Asset Management')).toBeInTheDocument();
    });

    // Open create dialog
    const addButton = screen.getByRole('button', { name: /add asset/i });
    await user.click(addButton);

    // Fill form with duplicate symbol
    const symbolInput = screen.getByLabelText(/symbol/i);
    const nameInput = screen.getByLabelText(/name/i);
    const createButton = screen.getByRole('button', { name: /create asset/i });

    await user.type(symbolInput, 'EURUSD');
    await user.type(nameInput, 'Euro / US Dollar');
    await user.click(createButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'An asset with this symbol already exists for your account'
      );
    });
  });

  it('updates asset successfully', async () => {
    const user = userEvent.setup();
    const updatedAsset: Asset = {
      ...mockAssets[0],
      name: 'Updated Euro / US Dollar',
      description: 'Updated description'
    };

    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: mockAssets
    });

    mockAssetActions.updateAsset.mockResolvedValue({
      success: true,
      asset: updatedAsset
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
    });

    // Click edit on first asset
    const editButtons = screen.getAllByLabelText(/open menu/i);
    await user.click(editButtons[0]);

    const editMenuItem = screen.getByText('Edit');
    await user.click(editMenuItem);

    // Update form
    const nameInput = screen.getByDisplayValue('Euro / US Dollar');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Euro / US Dollar');

    const updateButton = screen.getByRole('button', { name: /update asset/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockAssetActions.updateAsset).toHaveBeenCalledWith('1', {
        symbol: 'EURUSD',
        name: 'Updated Euro / US Dollar',
        description: 'Major currency pair'
      });
      expect(mockToast.success).toHaveBeenCalledWith('Asset updated successfully');
    });
  });

  it('deletes asset successfully', async () => {
    const user = userEvent.setup();
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: mockAssets
    });

    mockAssetActions.deleteAsset.mockResolvedValue({
      success: true
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
    });

    // Click delete on first asset
    const editButtons = screen.getAllByLabelText(/open menu/i);
    await user.click(editButtons[0]);

    const deleteMenuItem = screen.getByText('Delete');
    await user.click(deleteMenuItem);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /continue/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockAssetActions.deleteAsset).toHaveBeenCalledWith('1');
      expect(mockToast.success).toHaveBeenCalledWith('Asset deleted successfully');
    });
  });

  it('shows error when asset deletion fails', async () => {
    const user = userEvent.setup();
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: mockAssets
    });

    mockAssetActions.deleteAsset.mockResolvedValue({
      success: false,
      error: 'Failed to delete asset'
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(screen.getByText('EURUSD')).toBeInTheDocument();
    });

    // Click delete on first asset
    const editButtons = screen.getAllByLabelText(/open menu/i);
    await user.click(editButtons[0]);

    const deleteMenuItem = screen.getByText('Delete');
    await user.click(deleteMenuItem);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /continue/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete asset');
    });
  });

  it('handles empty state correctly', async () => {
    mockAssetActions.getAssets.mockResolvedValue({
      success: true,
      assets: []
    });

    render(<AssetManagementView />);

    await waitFor(() => {
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });
  });
});