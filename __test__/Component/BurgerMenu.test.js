import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BurgerMenu from '@/app/components/BurgerMenu';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock FontAwesomeIcon
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <div data-testid="mock-icon" />,
}));

describe('BurgerMenu', () => {
  // Test initial render
  it('renders the hamburger button', () => {
    render(<BurgerMenu isAuthenticated={false} />);
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(hamburgerButton).toBeInTheDocument();
  });

  // Test menu opening
  it('opens the menu when the hamburger button is clicked', () => {
    render(<BurgerMenu isAuthenticated={false} />);
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(hamburgerButton);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('navLinksActive');
  });

  // Test unauthenticated user view
  it('displays login and signup links for unauthenticated users', () => {
    render(<BurgerMenu isAuthenticated={false} />);
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(hamburgerButton);
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /signup/i })).toBeInTheDocument();
  });

  // Test authenticated user view
  it('displays appropriate links for authenticated users', () => {
    render(<BurgerMenu isAuthenticated={true} />);
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(hamburgerButton);
    expect(screen.getByRole('link', { name: /favourite pals/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /saved combinations/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
  });

  // Test logout functionality
  it('handles logout correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    );
    global.window.location = { href: 'http://localhost/' };

    render(<BurgerMenu isAuthenticated={true} />);
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(hamburgerButton);
    const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/auth/signout', { method: 'POST' });
      expect(global.window.location.href).toBe('http://localhost/');
    });
  });

  // Test menu closing when clicking outside
  it('closes the menu when clicking outside', () => {
    render(<BurgerMenu isAuthenticated={false} />);
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(hamburgerButton);
    fireEvent.mouseDown(document.body);
    const menu = screen.getByRole('menu');
    expect(menu).not.toHaveClass('navLinksActive');
  });
});