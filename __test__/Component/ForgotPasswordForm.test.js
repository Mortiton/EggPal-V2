import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordForm from "@/app/(auth)/forgot-password/components/ForgotPasswordForm";

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the authService
jest.mock("@/app/services/authService", () => ({
  resetPassword: jest.fn(),
}));

// Mock the SuccessModal component
jest.mock("@/app/components/SuccessModal", () => {
  return function DummySuccessModal({ isOpen, onConfirm, message }) {
    return isOpen ? (
      <div data-testid="success-modal">
        {message}
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null;
  };
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock the CSS module
jest.mock('@/app/components/styles/FormStyles.module.css', () => ({
  inputContainer: 'mockInputContainer',
  label: 'mockLabel',
  input: 'mockInput',
  validation: 'mockValidation',
  button: 'mockButton',
}));

describe('ForgotPasswordForm Component', () => {
  let mockPush;

  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean slate
    jest.clearAllMocks();
    mockPush = jest.fn();
    require('next/navigation').useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });

  it('renders the form correctly', () => {
    render(<ForgotPasswordForm />);
    
    // Ensure the email input and submit button are present in the document
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
  });

  it('displays validation error for invalid email', async () => {
    render(<ForgotPasswordForm />);
    
    const emailInput = screen.getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);  

    const submitButton = screen.getByRole('button', { name: 'Send reset link' });
    fireEvent.click(submitButton);

    // Wait for and check if the validation error message appears
    await waitFor(() => {
      const errorElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'div' && 
               content.toLowerCase().includes('invalid email');
      }, { timeout: 3000 });
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('displays validation error for empty email', async () => {
    render(<ForgotPasswordForm />);
    
    // Attempt to submit the form without entering an email
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    // Check if the 'Required' error message appears
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  it('submits the form with valid email and shows success modal', async () => {
    const { resetPassword } = require("@/app/services/authService");
    resetPassword.mockResolvedValue();

    render(<ForgotPasswordForm />);
    
    // Enter a valid email and submit the form
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    // Check if the resetPassword function was called and the success modal appears
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByTestId('success-modal')).toBeInTheDocument();
      expect(screen.getByText('Password reset email sent! Check your inbox.')).toBeInTheDocument();
    });
  });

  it('handles error when password reset fails', async () => {
    const { resetPassword } = require("@/app/services/authService");
    const error = new Error('Reset failed');
    resetPassword.mockRejectedValue(error);

    const { toast } = require('react-toastify');

    render(<ForgotPasswordForm />);
    
    // Enter an email and submit the form
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    // Check if the error toast is displayed with the correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to send reset email: Reset failed');
    });
  });

  it('redirects to login page after confirming success modal', async () => {
    const { resetPassword } = require("@/app/services/authService");
    resetPassword.mockResolvedValue();

    render(<ForgotPasswordForm />);
    
    // Submit the form with a valid email
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    // Click the confirm button in the success modal
    await waitFor(() => {
      fireEvent.click(screen.getByText('Confirm'));
    });

    // Check if the user is redirected to the login page
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('disables submit button while submitting', async () => {
    const { resetPassword } = require("@/app/services/authService");
    resetPassword.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ForgotPasswordForm />);
    
    // Submit the form with a valid email
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

    // Check if the submit button is disabled immediately after submission
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeDisabled();

    // Check if the submit button is re-enabled after the submission is complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Send reset link' })).not.toBeDisabled();
    });
  });

  it('has correct display name', () => {
    // Ensure the component has the correct display name
    expect(ForgotPasswordForm.displayName).toBe('ForgotPasswordForm');
  });
});