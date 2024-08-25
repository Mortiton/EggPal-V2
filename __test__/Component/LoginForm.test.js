import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '@/app/(auth)/login/components/LoginForm';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock the authService
jest.mock("@/app/services/authService", () => ({
  login: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', async () => {
    await act(async () => {
      render(<LoginForm />);
    });
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    await act(async () => {
      render(<LoginForm />);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });

    await waitFor(() => {
      expect(screen.getAllByText(/required/i)).toHaveLength(2);
    });
  });

  it('displays an error for invalid email', async () => {
    await act(async () => {
      render(<LoginForm />);
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalidemail' } });
      fireEvent.blur(screen.getByLabelText(/email address/i)); // Trigger validation
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    }, { timeout: 3000 }); 
  });

  it('submits the form with valid data', async () => {
    const { login } = require("@/app/services/authService");
    login.mockResolvedValue({ success: true });

    await act(async () => {
      render(<LoginForm />);
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(expect.any(FormData));
      expect(require('react-toastify').toast.success).toHaveBeenCalledWith('Logged in successfully');
    });
  });

  it('handles login failure', async () => {
    const { login } = require("@/app/services/authService");
    login.mockRejectedValue(new Error('Invalid credentials'));

    await act(async () => {
      render(<LoginForm />);
    });
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
    
    // Ensure that the toast.error was not called
    expect(require('react-toastify').toast.error).not.toHaveBeenCalled();
  });

  it('navigates to forgot password page', async () => {
    const pushMock = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({
      push: pushMock,
      refresh: jest.fn(),
    }));

    await act(async () => {
      render(<LoginForm />);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    });

    expect(pushMock).toHaveBeenCalledWith('/forgot-password');
  });
});