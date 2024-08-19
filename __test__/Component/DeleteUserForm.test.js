import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteUserForm from '@/app/profile/components/DeleteUserForm';
import { deleteUser } from '@/app/services/profileService';
import { toast } from 'react-toastify';

// Mock the profileService module
jest.mock('@/app/services/profileService', () => ({
  deleteUser: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock the CSS module
jest.mock('@/app/components/styles/FormStyles.module.css', () => ({
  inputContainer: 'mockInputContainer',
  button: 'mockButton',
  cancelButton: 'mockCancelButton',
}));

// Mock the fetch function
global.fetch = jest.fn();

// Mock window.location.assign
const mockAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: { assign: mockAssign },
  writable: true,
});

describe('DeleteUserForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: Initial render
  it('renders the initial delete button', () => {
    render(<DeleteUserForm />);
    const deleteButton = screen.getByText('Delete Account');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveStyle({ backgroundColor: 'red', color: 'white' });
  });

  // Test case: Confirmation buttons appear after initial click
  it('shows confirmation buttons when delete is clicked', () => {
    render(<DeleteUserForm />);
    fireEvent.click(screen.getByText('Delete Account'));
    
    expect(screen.getByText('Are you sure? Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  // Test case: Cancel button functionality
  it('hides confirmation buttons when cancel is clicked', () => {
    render(<DeleteUserForm />);
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(screen.queryByText('Are you sure? Confirm Delete')).not.toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
  });

  // Test case: Successful user deletion with successful logout
  it('redirects to success page with correct message when deletion and logout are successful', async () => {
    deleteUser.mockResolvedValue({ success: true, message: 'User deleted successfully' });
    global.fetch.mockResolvedValue({ ok: true });
    
    render(<DeleteUserForm />);
    
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Are you sure? Confirm Delete'));
    
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith('/auth/signout', { method: 'POST' });
      expect(mockAssign).toHaveBeenCalledWith(expect.stringContaining('/success?title=Account%20Deleted&description=User%20deleted%20successfully'));
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  // Test case: Successful user deletion with failed logout
  it('redirects to success page with logout failed message when deletion succeeds but logout fails', async () => {
    deleteUser.mockResolvedValue({ success: true, message: 'User deleted successfully' });
    global.fetch.mockResolvedValue({ ok: false });
    
    render(<DeleteUserForm />);
    
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Are you sure? Confirm Delete'));
    
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith('/auth/signout', { method: 'POST' });
      expect(mockAssign).toHaveBeenCalledWith(expect.stringContaining('/success?title=Account%20Deleted&description=Account%20deleted%20but%20logout%20failed.%20Please%20manually%20log%20out.'));
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  // Test case: Unexpected error
  it('displays a toast error message for unexpected errors', async () => {
    deleteUser.mockResolvedValue({ success: false });
    
    render(<DeleteUserForm />);
    
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Are you sure? Confirm Delete'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred');
    });
    expect(mockAssign).not.toHaveBeenCalled();
  });

  // Test case: Error from deleteUser function
  it('displays a toast error message when deleteUser returns an error', async () => {
    const errorMessage = 'Failed to delete user';
    deleteUser.mockResolvedValue({ error: errorMessage });
    
    render(<DeleteUserForm />);
    
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Are you sure? Confirm Delete'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
    expect(mockAssign).not.toHaveBeenCalled();
  });

  // Test case: Network error
  it('displays a toast error message for network errors', async () => {
    deleteUser.mockRejectedValue(new Error('Network error'));
    
    render(<DeleteUserForm />);
    
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Are you sure? Confirm Delete'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
    expect(mockAssign).not.toHaveBeenCalled();
  });
});