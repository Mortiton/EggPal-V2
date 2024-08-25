import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupPage from '@/app/(auth)/signup/page';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the SignupForm component
jest.mock('@/app/(auth)/signup/components/SignupForm', () => {
  return function MockedSignupForm() {
    return <div data-testid="signup-form">Mocked Signup Form</div>;
  };
});

describe('SignupPage', () => {
  it('renders the page title', () => {
    render(<SignupPage searchParams={{}} />);
    const heading = screen.getByRole('heading', { name: /Sign Up/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<SignupPage searchParams={{}} />);
    const description = screen.getByText(/Create an account by entering your details below/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the SignupForm component', () => {
    render(<SignupPage searchParams={{}} />);
    const form = screen.getByTestId('signup-form');
    expect(form).toBeInTheDocument();
  });

  it('renders the link to sign in page', () => {
    render(<SignupPage searchParams={{}} />);
    const signInLink = screen.getByRole('link', { name: /Sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', './login');
  });

  it('renders the "Already have an account?" text', () => {
    render(<SignupPage searchParams={{}} />);
    const text = screen.getByText(/Already have an account\?/i);
    expect(text).toBeInTheDocument();
  });

  it('does not render error message when no error is present', () => {
    render(<SignupPage searchParams={{}} />);
    const errorMessage = screen.queryByText(/Passwords do not match./i);
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('renders password mismatch error when present', () => {
    render(<SignupPage searchParams={{ error: 'password_mismatch' }} />);
    const errorMessage = screen.getByText(/Passwords do not match./i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders signup failed error when present', () => {
    render(<SignupPage searchParams={{ error: 'signup_failed' }} />);
    const errorMessage = screen.getByText(/Signup failed. Please try again./i);
    expect(errorMessage).toBeInTheDocument();
  });
});