import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the ForgotPasswordForm component
jest.mock('@/app/(auth)/forgot-password/components/ForgotPasswordForm', () => {
  return function MockedForgotPasswordForm() {
    return <div data-testid="forgot-password-form">Mocked Form</div>;
  };
});

describe('ForgotPasswordPage', () => {
  it('renders the page title', () => {
    render(<ForgotPasswordPage />);
    const heading = screen.getByRole('heading', { name: /Reset Your Password/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<ForgotPasswordPage />);
    const description = screen.getByText(/Enter your email below to send a recover password email./i);
    expect(description).toBeInTheDocument();
  });

  it('renders the ForgotPasswordForm component', () => {
    render(<ForgotPasswordPage />);
    const form = screen.getByTestId('forgot-password-form');
    expect(form).toBeInTheDocument();
  });

  it('renders the link to sign in page', () => {
    render(<ForgotPasswordPage />);
    const signInLink = screen.getByRole('link', { name: /Sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', './login');
  });
});