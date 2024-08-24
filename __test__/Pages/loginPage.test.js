import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the LoginForm component
jest.mock('@/app/(auth)/login/components/LoginForm', () => {
  return function MockedLoginForm() {
    return <div data-testid="login-form">Mocked Login Form</div>;
  };
});

describe('LoginPage', () => {
  it('renders the page title', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: /Login/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<LoginPage />);
    const description = screen.getByText(/Enter your credentials below to log into your account/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the LoginForm component', () => {
    render(<LoginPage />);
    const form = screen.getByTestId('login-form');
    expect(form).toBeInTheDocument();
  });

  it('renders the link to sign up page', () => {
    render(<LoginPage />);
    const signUpLink = screen.getByRole('link', { name: /Sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', './signup');
  });

  it('renders the "Don\'t have an account?" text', () => {
    render(<LoginPage />);
    const text = screen.getByText(/Don't have an account\?/i);
    expect(text).toBeInTheDocument();
  });
});