import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteUserForm from '@/app/profile/components/DeleteUserForm';
import { deleteUser } from '@/app/profile/actions';

// Mock the deleteUser function
jest.mock('@/app/profile/actions', () => ({
  deleteUser: jest.fn(),
}));

/**
 * Test suite for the DeleteUserForm component.
 */
describe('DeleteUserForm component', () => {

  beforeEach(() => {
    deleteUser.mockClear();
  });

  test('renders the delete button initially', () => {
    render(<DeleteUserForm />);

    expect(screen.getByText(/Delete Account/i)).toBeInTheDocument();
  });

  test('shows confirmation buttons when delete button is clicked', () => {
    render(<DeleteUserForm />);

    fireEvent.click(screen.getByText(/Delete Account/i));

    expect(screen.getByText(/Are you sure\? Confirm Delete/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  test('cancels the delete action when cancel button is clicked', () => {
    render(<DeleteUserForm />);

    fireEvent.click(screen.getByText(/Delete Account/i));
    fireEvent.click(screen.getByText(/Cancel/i));

    expect(screen.queryByText(/Are you sure\? Confirm Delete/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Delete Account/i)).toBeInTheDocument();
  });

  test('calls deleteUser and handles success', async () => {
    deleteUser.mockResolvedValueOnce({});

    render(<DeleteUserForm />);

    fireEvent.click(screen.getByText(/Delete Account/i));
    fireEvent.click(screen.getByText(/Are you sure\? Confirm Delete/i));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
    });
  });

  test('shows error message when deleteUser fails', async () => {
    const errorMessage = 'Delete failed';
    deleteUser.mockRejectedValueOnce(new Error(errorMessage));

    render(<DeleteUserForm />);

    fireEvent.click(screen.getByText(/Delete Account/i));
    fireEvent.click(screen.getByText(/Are you sure\? Confirm Delete/i));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });
});
