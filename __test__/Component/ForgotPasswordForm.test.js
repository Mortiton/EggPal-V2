import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPasswordForm from '@/app/(auth)/forgot-password/components/ForgotPasswordForm';
import { resetPassword } from '@/app/services/authService';

jest.mock('@/app/services/authService', () => ({
  resetPassword: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/app/components/styles/FormStyles.module.css', () => ({
  inputContainer: 'mockInputContainer',
  input: 'mockInput',
  button: 'mockButton',
  error: 'mockError',
  validation: 'mockValidation',
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
  });

  it('handles form submission correctly on success', async () => {
    resetPassword.mockResolvedValue({ success: true, message: 'Reset email sent' });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('test@example.com');
      expect(mockPush).toHaveBeenCalledWith(
        '/success?title=Password%20Reset%20Email%20Sent&description=Reset%20email%20sent'
      );
    });
  });

  it('handles error from resetPassword service', async () => {
    resetPassword.mockResolvedValue({ success: false, message: 'User not found' });
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  it('handles unexpected errors', async () => {
    resetPassword.mockRejectedValue(new Error('Unexpected error'));
    
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});