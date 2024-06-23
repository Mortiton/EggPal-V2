import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BurgerMenu from '@/app/components/BurgerMenu';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Mock the FontAwesomeIcon component to avoid errors during testing
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <div />,
}));

describe('BurgerMenu Component', () => {
  /**
   * Test to verify the component renders without crashing.
   */
  it('renders without crashing', () => {
    render(<BurgerMenu user={null} />);
  });

  /**
   * Test to verify the menu toggles when the hamburger icon is clicked.
   */
  it('toggles menu when hamburger icon is clicked', () => {
    render(<BurgerMenu user={null} />);

    const button = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(button);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });

  /**
   * Test to verify clicking outside the menu closes it.
   */
  it('closes menu when clicking outside', () => {
    render(<BurgerMenu user={null} />);

    const button = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(button);

    let menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    fireEvent.mouseDown(document);
    expect(menu).not.toBeInTheDocument();
  });

  /**
   * Test to verify the menu displays user-specific options when a user is logged in.
   */
  it('displays user-specific options when user is logged in', () => {
    const user = { id: 1, name: 'Test User' };
    render(<BurgerMenu user={user} />);

    const button = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(button);

    expect(screen.getByText(/Favourite Pals/i)).toBeInTheDocument();
    expect(screen.getByText(/Saved Combinations/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  /**
   * Test to verify the menu displays guest-specific options when no user is logged in.
   */
  it('displays guest-specific options when no user is logged in', () => {
    render(<BurgerMenu user={null} />);

    const button = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(button);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
  });
});