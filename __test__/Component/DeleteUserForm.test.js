

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteUserForm from '@/app/profile/components/DeleteUserForm';
import { deleteUser } from '@/app/services/profileService';

// Mock the profileService module
jest.mock('@/app/services/profileService', () => ({
  deleteUser: jest.fn(),
}));

// Mock the CSS module
jest.mock('@/app/components/styles/FormStyles.module.css', () => ({
  inputContainer: 'mockInputContainer',
  error: 'mockError',
  button: 'mockButton',
  cancelButton: 'mockCancelButton',
}));

describe('DeleteUserForm Component', () => {
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

  // Test case: Successful user deletion
  it('calls deleteUser when confirm delete is clicked', async () => {
    deleteUser.mockResolvedValue();
    render(<DeleteUserForm />);
    
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Are you sure? Confirm Delete'));
    
    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // Test case: Error handling
  it('displays an error message when deleteUser fails', async () => {
    const errorMessage = 'Failed to delete user';
    deleteUser.mockRejectedValue(new Error(errorMessage));
    render(<DeleteUserForm />);
    
    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Are you sure? Confirm Delete'));
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    });
  });
});