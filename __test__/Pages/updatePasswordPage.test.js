import React from 'react';
import { render, screen } from '@testing-library/react';
import UpdatePasswordPage from '@/app/(auth)/update-password/page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
    useRouter() {
      return {
        push: jest.fn(),
        replace: jest.fn(),
      };
    },
    useSearchParams() {
      return {
        get: jest.fn(),
      };
    },
  }));
  

// Mock the UpdatePasswordForm component
jest.mock('@/app/(auth)/update-password/components/UpdatePasswordForm', () => {
  return function MockedUpdatePasswordForm({ token }) {
    return <div data-testid="update-password-form">Mocked Update Password Form (Token: {token})</div>;
  };
});

describe('UpdatePasswordPage', () => {
    describe('with valid token and type', () => {
      const validSearchParams = { token: 'valid-token', type: 'recovery' };
  
      it('renders the page title', () => {
        render(<UpdatePasswordPage searchParams={validSearchParams} />);
        const heading = screen.getByRole('heading', { name: /Update Your Password/i });
        expect(heading).toBeInTheDocument();
      });
  
      it('renders the description', () => {
        render(<UpdatePasswordPage searchParams={validSearchParams} />);
        const description = screen.getByText(/Enter your new password below./i);
        expect(description).toBeInTheDocument();
      });
  
      it('renders the UpdatePasswordForm', () => {
        render(<UpdatePasswordPage searchParams={validSearchParams} />);
        const form = screen.getByTestId('update-password-form');
        expect(form).toBeInTheDocument();
        expect(form).toHaveTextContent('Mocked Update Password Form (Token: valid-token)');
      });
    });
  
    describe('with invalid token or type', () => {
      it('renders invalid reset link message when token is missing', () => {
        render(<UpdatePasswordPage searchParams={{ type: 'recovery' }} />);
        const heading = screen.getByRole('heading', { name: /Invalid Reset Link/i });
        expect(heading).toBeInTheDocument();
        const message = screen.getByText(/The password reset link is invalid or has expired./i);
        expect(message).toBeInTheDocument();
      });
  
      it('renders invalid reset link message when type is not recovery', () => {
        render(<UpdatePasswordPage searchParams={{ token: 'valid-token', type: 'wrong-type' }} />);
        const heading = screen.getByRole('heading', { name: /Invalid Reset Link/i });
        expect(heading).toBeInTheDocument();
        const message = screen.getByText(/The password reset link is invalid or has expired./i);
        expect(message).toBeInTheDocument();
      });
  
      it('does not render the UpdatePasswordForm when link is invalid', () => {
        render(<UpdatePasswordPage searchParams={{ token: 'valid-token', type: 'wrong-type' }} />);
        const form = screen.queryByTestId('update-password-form');
        expect(form).not.toBeInTheDocument();
      });
    });
  });