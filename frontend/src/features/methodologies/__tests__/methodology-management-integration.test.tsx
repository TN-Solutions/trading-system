import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MethodologyManagementView } from '../page-views/methodology-management-view';
import * as methodologyActions from '../actions/methodology-actions';
import { Methodology } from '@/types/methodology';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('../actions/methodology-actions');
jest.mock('sonner');

const mockMethodologyActions = methodologyActions as jest.Mocked<typeof methodologyActions>;
const mockToast = toast as jest.Mocked<typeof toast>;

const mockMethodologies: Methodology[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'ICT',
    description: 'Inner Circle Trader methodology',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Smart Money Concepts',
    description: 'Advanced price action methodology',
    created_at: '2023-01-02T00:00:00Z'
  }
];

describe('MethodologyManagementView Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
  });

  it('loads and displays methodologies on mount', async () => {
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: mockMethodologies
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('ICT')).toBeInTheDocument();
      expect(screen.getByText('Smart Money Concepts')).toBeInTheDocument();
      expect(screen.getByText('Inner Circle Trader methodology')).toBeInTheDocument();
    });

    expect(mockMethodologyActions.getMethodologies).toHaveBeenCalledTimes(1);
  });

  it('shows loading state while fetching methodologies', () => {
    mockMethodologyActions.getMethodologies.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<MethodologyManagementView />);

    expect(screen.getByText('Loading methodologies...')).toBeInTheDocument();
  });

  it('shows error message when fetching methodologies fails', async () => {
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: false,
      error: 'Failed to fetch methodologies'
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to fetch methodologies');
    });
  });

  it('opens create methodology dialog when add button is clicked', async () => {
    const user = userEvent.setup();
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: []
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Methodology Management')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add methodology/i });
    await user.click(addButton);

    expect(screen.getByText('Create New Methodology')).toBeInTheDocument();
  });

  it('creates new methodology successfully', async () => {
    const user = userEvent.setup();
    const newMethodology: Methodology = {
      id: '3',
      user_id: 'user-1',
      name: 'Elliott Wave',
      description: 'Wave analysis methodology',
      created_at: '2023-01-03T00:00:00Z'
    };

    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: mockMethodologies
    });

    mockMethodologyActions.createMethodology.mockResolvedValue({
      success: true,
      methodology: newMethodology
    });

    render(<MethodologyManagementView />);

    // Wait for methodologies to load
    await waitFor(() => {
      expect(screen.getByText('ICT')).toBeInTheDocument();
    });

    // Open create dialog
    const addButton = screen.getByRole('button', { name: /add methodology/i });
    await user.click(addButton);

    // Fill form
    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const createButton = screen.getByRole('button', { name: /create methodology/i });

    await user.type(nameInput, 'Elliott Wave');
    await user.type(descriptionInput, 'Wave analysis methodology');
    await user.click(createButton);

    await waitFor(() => {
      expect(mockMethodologyActions.createMethodology).toHaveBeenCalledWith({
        name: 'Elliott Wave',
        description: 'Wave analysis methodology'
      });
      expect(mockToast.success).toHaveBeenCalledWith('Methodology created successfully');
    });
  });

  it('shows error when methodology creation fails', async () => {
    const user = userEvent.setup();
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: []
    });

    mockMethodologyActions.createMethodology.mockResolvedValue({
      success: false,
      error: 'A methodology with this name already exists for your account'
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Methodology Management')).toBeInTheDocument();
    });

    // Open create dialog
    const addButton = screen.getByRole('button', { name: /add methodology/i });
    await user.click(addButton);

    // Fill form with duplicate name
    const nameInput = screen.getByLabelText(/name/i);
    const createButton = screen.getByRole('button', { name: /create methodology/i });

    await user.type(nameInput, 'ICT');
    await user.click(createButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'A methodology with this name already exists for your account'
      );
    });
  });

  it('updates methodology successfully', async () => {
    const user = userEvent.setup();
    const updatedMethodology: Methodology = {
      ...mockMethodologies[0],
      name: 'Updated ICT',
      description: 'Updated Inner Circle Trader methodology'
    };

    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: mockMethodologies
    });

    mockMethodologyActions.updateMethodology.mockResolvedValue({
      success: true,
      methodology: updatedMethodology
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('ICT')).toBeInTheDocument();
    });

    // Click edit on first methodology
    const editButtons = screen.getAllByLabelText(/open menu/i);
    await user.click(editButtons[0]);

    const editMenuItem = screen.getByText('Edit');
    await user.click(editMenuItem);

    // Update form
    const nameInput = screen.getByDisplayValue('ICT');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated ICT');

    const updateButton = screen.getByRole('button', { name: /update methodology/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(mockMethodologyActions.updateMethodology).toHaveBeenCalledWith('1', {
        name: 'Updated ICT',
        description: 'Inner Circle Trader methodology'
      });
      expect(mockToast.success).toHaveBeenCalledWith('Methodology updated successfully');
    });
  });

  it('deletes methodology successfully', async () => {
    const user = userEvent.setup();
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: mockMethodologies
    });

    mockMethodologyActions.deleteMethodology.mockResolvedValue({
      success: true
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('ICT')).toBeInTheDocument();
    });

    // Click delete on first methodology
    const editButtons = screen.getAllByLabelText(/open menu/i);
    await user.click(editButtons[0]);

    const deleteMenuItem = screen.getByText('Delete');
    await user.click(deleteMenuItem);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /continue/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockMethodologyActions.deleteMethodology).toHaveBeenCalledWith('1');
      expect(mockToast.success).toHaveBeenCalledWith('Methodology deleted successfully');
    });
  });

  it('shows error when methodology deletion fails', async () => {
    const user = userEvent.setup();
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: mockMethodologies
    });

    mockMethodologyActions.deleteMethodology.mockResolvedValue({
      success: false,
      error: 'Failed to delete methodology'
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('ICT')).toBeInTheDocument();
    });

    // Click delete on first methodology
    const editButtons = screen.getAllByLabelText(/open menu/i);
    await user.click(editButtons[0]);

    const deleteMenuItem = screen.getByText('Delete');
    await user.click(deleteMenuItem);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /continue/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to delete methodology');
    });
  });

  it('handles empty state correctly', async () => {
    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: []
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });
  });

  it('creates methodology with empty description', async () => {
    const user = userEvent.setup();
    const newMethodology: Methodology = {
      id: '3',
      user_id: 'user-1',
      name: 'Fibonacci',
      description: '',
      created_at: '2023-01-03T00:00:00Z'
    };

    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: []
    });

    mockMethodologyActions.createMethodology.mockResolvedValue({
      success: true,
      methodology: newMethodology
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('Methodology Management')).toBeInTheDocument();
    });

    // Open create dialog
    const addButton = screen.getByRole('button', { name: /add methodology/i });
    await user.click(addButton);

    // Fill form with only name
    const nameInput = screen.getByLabelText(/name/i);
    const createButton = screen.getByRole('button', { name: /create methodology/i });

    await user.type(nameInput, 'Fibonacci');
    await user.click(createButton);

    await waitFor(() => {
      expect(mockMethodologyActions.createMethodology).toHaveBeenCalledWith({
        name: 'Fibonacci',
        description: ''
      });
      expect(mockToast.success).toHaveBeenCalledWith('Methodology created successfully');
    });
  });

  it('displays methodology description or dash if empty', async () => {
    const methodologiesWithEmptyDesc: Methodology[] = [
      {
        id: '1',
        user_id: 'user-1',
        name: 'ICT',
        description: 'Inner Circle Trader methodology',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        user_id: 'user-1',
        name: 'Fibonacci',
        description: '',
        created_at: '2023-01-02T00:00:00Z'
      }
    ];

    mockMethodologyActions.getMethodologies.mockResolvedValue({
      success: true,
      methodologies: methodologiesWithEmptyDesc
    });

    render(<MethodologyManagementView />);

    await waitFor(() => {
      expect(screen.getByText('ICT')).toBeInTheDocument();
      expect(screen.getByText('Fibonacci')).toBeInTheDocument();
      expect(screen.getByText('Inner Circle Trader methodology')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument(); // For empty description
    });
  });
});