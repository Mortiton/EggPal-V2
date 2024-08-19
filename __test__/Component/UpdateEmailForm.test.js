import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateEmailForm from '@/app/profile/components/UpdateEmailForm';
import { updateEmail } from '@/app/services/profileService';
import { toast } from 'react-toastify';

// Mock the profileService
jest.mock('@/app/services/profileService', () => ({
  updateEmail: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UpdateEmailForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields correctly', () => {
    render(<UpdateEmailForm />);
    
    const emailInput = screen.getByRole('textbox', { name: /email input field/i });
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');

    expect(screen.getByText(/email:/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /update email/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Update Email');
  });

  it('displays validation error for invalid email', async () => {
    render(<UpdateEmailForm />);
    
    await act(async () => {
      const emailInput = screen.getByRole('textbox', { name: /email input field/i });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('displays required error when submitting empty form', async () => {
    render(<UpdateEmailForm />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  it('calls updateEmail service and shows success toast on successful submission', async () => {
    updateEmail.mockResolvedValue({ success: true });
    
    render(<UpdateEmailForm />);
    
    await act(async () => {
      const emailInput = screen.getByRole('textbox', { name: /email input field/i });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    });

    await waitFor(() => {
      expect(updateEmail).toHaveBeenCalledWith('new@example.com');
      expect(toast.success).toHaveBeenCalledWith(
        "Please confirm the change on your new email address.",
        expect.any(Object)
      );
    });
  });

  it('shows error toast on failed submission', async () => {
    const errorMessage = 'Failed to update email';
    updateEmail.mockResolvedValue({ error: errorMessage });
    
    render(<UpdateEmailForm />);
    
    await act(async () => {
      const emailInput = screen.getByRole('textbox', { name: /email input field/i });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    });

    await waitFor(() => {
      expect(updateEmail).toHaveBeenCalledWith('new@example.com');
      expect(toast.error).toHaveBeenCalledWith(
        errorMessage,
        expect.any(Object)
      );
    });
  });

  it('shows error toast on unexpected error', async () => {
    updateEmail.mockRejectedValue(new Error('Unexpected error'));
    
    render(<UpdateEmailForm />);
    
    await act(async () => {
      const emailInput = screen.getByRole('textbox', { name: /email input field/i });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    });

    await waitFor(() => {
      expect(updateEmail).toHaveBeenCalledWith('new@example.com');
      expect(toast.error).toHaveBeenCalledWith(
        'Unexpected error',
        expect.any(Object)
      );
    });
  });

  it('resets form after successful submission', async () => {
    updateEmail.mockResolvedValue({ success: true });
    
    render(<UpdateEmailForm />);
    
    await act(async () => {
      const emailInput = screen.getByRole('textbox', { name: /email input field/i });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /update email/i }));
    });

    await waitFor(() => {
      const emailInput = screen.getByRole('textbox', { name: /email input field/i });
      expect(emailInput).toHaveValue('');
    });
  });
});