import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdatePasswordForm from '@/app/profile/components/UpdatePasswordForm';
import { updatePassword } from '@/app/services/profileService';
import { toast } from 'react-toastify';

jest.mock('@/app/services/profileService', () => ({
  updatePassword: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields correctly', () => {
    render(<UpdatePasswordForm />);
    
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm new password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });

  describe('Form Validation', () => {
    it('displays validation errors for invalid inputs', async () => {
      render(<UpdatePasswordForm />);
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /update password/i }));
      });

      await waitFor(() => {
        expect(screen.getAllByText(/required/i)).toHaveLength(3);
      });
    });

    it('displays password mismatch error', async () => {
      render(<UpdatePasswordForm />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^new password:/i), { target: { value: 'StrongPass1!' } });
        fireEvent.change(screen.getByLabelText(/^confirm new password:/i), { target: { value: 'MismatchPass1!' } });
        fireEvent.blur(screen.getByLabelText(/^confirm new password:/i));
      });
    
      await waitFor(() => {
        expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('displays password length error', async () => {
      render(<UpdatePasswordForm />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^new password:/i), { target: { value: 'weak' } });
        fireEvent.blur(screen.getByLabelText(/^new password:/i));
        fireEvent.click(screen.getByRole('button', { name: /update password/i }));
      });

      await waitFor(() => {
        expect(screen.getByText("Password is too short - should be 8 chars minimum.")).toBeInTheDocument();
      });
    });

    it('displays password complexity error', async () => {
      render(<UpdatePasswordForm />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^new password:/i), { target: { value: 'password123' } });
        fireEvent.blur(screen.getByLabelText(/^new password:/i));
        fireEvent.click(screen.getByRole('button', { name: /update password/i }));
      });

      await waitFor(() => {
        expect(screen.getByText("Password must contain an uppercase letter, a lowercase letter, a number, and a special character.")).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('calls updatePassword service and shows success toast on successful submission', async () => {
      updatePassword.mockResolvedValue();
      
      render(<UpdatePasswordForm />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'CurrentPass1!' } });
        fireEvent.change(screen.getByLabelText(/^new password:/i), { target: { value: 'NewStrongPass1!' } });
        fireEvent.change(screen.getByLabelText(/^confirm new password:/i), { target: { value: 'NewStrongPass1!' } });
        fireEvent.click(screen.getByRole('button', { name: /update password/i }));
      });
    
      await waitFor(() => {
        expect(updatePassword).toHaveBeenCalledWith('CurrentPass1!', 'NewStrongPass1!');
      }, { timeout: 2000 });
    
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Your password has been successfully updated.",
          expect.any(Object)
        );
      }, { timeout: 2000 });
    });

    it('shows error toast on failed submission', async () => {
      const errorMessage = 'Failed to update password';
      updatePassword.mockRejectedValue(new Error(errorMessage));
      
      render(<UpdatePasswordForm />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'CurrentPass1!' } });
        fireEvent.change(screen.getByLabelText(/^new password:/i), { target: { value: 'NewStrongPass1!' } });
        fireEvent.change(screen.getByLabelText(/^confirm new password:/i), { target: { value: 'NewStrongPass1!' } });
        fireEvent.click(screen.getByRole('button', { name: /update password/i }));
      });
    
      await waitFor(() => {
        expect(updatePassword).toHaveBeenCalledWith('CurrentPass1!', 'NewStrongPass1!');
      }, { timeout: 2000 });
    
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          errorMessage,
          expect.any(Object)
        );
      }, { timeout: 2000 });
    });
  });
});