import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from "@/app/(auth)/signup/components/SignupForm";
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { toast } from 'react-toastify';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the Supabase client
jest.mock('@/app/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

// Mock the react-toastify module
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock the TermsOfServiceModal component
jest.mock('@/app/(auth)/signup/components/TermsOfServiceModal', () => {
  return function DummyTermsOfServiceModal({ isOpen, onAccept }) {
    return isOpen ? <div data-testid="terms-modal"><button onClick={onAccept}>Accept</button></div> : null;
  };
});

// Mock the SuccessModal component
jest.mock('@/app/components/SuccessModal', () => {
  return function DummySuccessModal({ isOpen, onConfirm }) {
    return isOpen ? <div data-testid="success-modal"><button onClick={onConfirm}>Confirm</button></div> : null;
  };
});

describe('SignupForm', () => {
  let mockRouter;
  let mockSupabaseAuth;

  // Reset mocks before each test
  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    mockSupabaseAuth = {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    };
    createClient.mockReturnValue({ auth: mockSupabaseAuth });
  });

  it('renders the signup form with all fields', () => {
    render(<SignupForm />);
    
    // Check if all form fields and submit button are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('displays validation errors for invalid inputs', async () => {
    render(<SignupForm />);
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getAllByText('Required')).toHaveLength(3);
    });
  });

  it('displays an error if the user is already registered', async () => {
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({ data: { user: {} } });

    render(<SignupForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('User already registered')).toBeInTheDocument();
    });
  });

  it('opens the terms modal when form is submitted successfully', async () => {
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({ data: null, error: null });

    render(<SignupForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check if the terms modal is displayed
    await waitFor(() => {
      expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    });
  });

  it('signs up the user when terms are accepted', async () => {
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({ data: null, error: null });
    mockSupabaseAuth.signUp.mockResolvedValue({ error: null });

    render(<SignupForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the terms modal to appear and accept the terms
    await waitFor(() => {
      expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Accept'));

    // Check if signup was called and success modal is displayed
    await waitFor(() => {
      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(screen.getByTestId('success-modal')).toBeInTheDocument();
    });
  });

  it('displays an error toast when signup fails', async () => {
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({ data: null, error: null });
    mockSupabaseAuth.signUp.mockRejectedValue(new Error('Signup failed'));

    render(<SignupForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the terms modal to appear and accept the terms
    await waitFor(() => {
      expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Accept'));

    // Check if error toast was displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Signup failed');
    });
  });

  it('redirects to home page and refreshes after successful signup', async () => {
    mockSupabaseAuth.signInWithPassword.mockResolvedValue({ data: null, error: null });
    mockSupabaseAuth.signUp.mockResolvedValue({ error: null });

    render(<SignupForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the terms modal to appear and accept the terms
    await waitFor(() => {
      expect(screen.getByTestId('terms-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Accept'));

    // Wait for the success modal to appear and confirm
    await waitFor(() => {
      expect(screen.getByTestId('success-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Confirm'));

    // Check if redirect and refresh were called
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});