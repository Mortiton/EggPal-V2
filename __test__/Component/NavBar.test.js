import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '@/app/components/NavBar';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the BurgerMenu component
jest.mock('@/app/components/BurgerMenu', () => {
  return function MockBurgerMenu({ isAuthenticated }) {
    return <div data-testid="burger-menu">MockBurgerMenu</div>;
  };
});

describe('NavBar', () => {
  it('renders the logo link', () => {
    render(<NavBar />);
    const logoLink = screen.getByRole('link', { name: /EggPal/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders login and signup links when user is not authenticated', () => {
    render(<NavBar user={null} />);
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /signup/i })).toBeInTheDocument();
  });

  it('renders authenticated user links when user is authenticated', () => {
    render(<NavBar user={{ id: '1', name: 'Test User' }} />);
    expect(screen.getByRole('link', { name: /favourite pals/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /saved combinations/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    
    // Check for the logout button
    const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveAttribute('type', 'submit');
    
    // Check if the logout button is within a form
    const form = logoutButton.closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('action', '/auth/signout');
    expect(form).toHaveAttribute('method', 'post');
  });

  it('does not render login and signup links when user is authenticated', () => {
    render(<NavBar user={{ id: '1', name: 'Test User' }} />);
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /signup/i })).not.toBeInTheDocument();
  });

  it('renders the BurgerMenu component', () => {
    render(<NavBar />);
    expect(screen.getByTestId('burger-menu')).toBeInTheDocument();
  });
});