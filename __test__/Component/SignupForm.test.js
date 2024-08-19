import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from '@/app/(auth)/signup/components/SignupForm';
import { signup } from '@/app/services/authService';
import { useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the authService
jest.mock('@/app/services/authService', () => ({
  signup: jest.fn(),
}));

// Mock the TermsOfServiceModal component
jest.mock('@/app/(auth)/signup/components/TermsOfServiceModal', () => {
  return function MockTermsOfServiceModal({ isOpen, onRequestClose, onAccept }) {
    return isOpen ? (
      <div data-testid="terms-modal">
        <button onClick={onRequestClose}>Close</button>
        <button onClick={onAccept}>Accept</button>
      </div>
    ) : null;
  };
});

describe('SignupForm Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields correctly', () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('displays validation errors for invalid inputs', async () => {
    render(<SignupForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      const requiredErrors = screen.getAllByText(/required/i);
      expect(requiredErrors).toHaveLength(3); // Expect 3 "Required" error messages
      expect(screen.getByText(/required/i, { selector: '#emailError' })).toBeInTheDocument();
      expect(screen.getByText(/required/i, { selector: '#passwordError' })).toBeInTheDocument();
      expect(screen.getByText(/required/i, { selector: '#confirmPasswordError' })).toBeInTheDocument();
    });
  });

  it('opens the terms modal when form is submitted with valid data', async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    });
  });

  it('calls signup service and redirects on successful signup', async () => {
    signup.mockResolvedValue({ success: true });

    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(expect.any(FormData));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/success'));
    });
  });

  it('displays an error message on signup failure', async () => {
    signup.mockResolvedValue({ success: false, message: 'Signup failed' });

    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
    });
  });
});