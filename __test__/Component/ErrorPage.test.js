import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from '@/app/error/page'; 

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the CSS module
jest.mock('./styles/page.module.css', () => ({
  container: 'mockContainer',
  heading: 'mockHeading',
  description: 'mockDescription',
  button: 'mockButton',
}));

describe('ErrorPage Component', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: Component renders correctly
  it('renders the error page with correct elements', () => {
    render(<ErrorPage />);

    // Check if the heading is rendered
    expect(screen.getByRole('heading', { name: /Error/i })).toBeInTheDocument();

    // Check if the error message is displayed
    expect(screen.getByText('Sorry, something went wrong.')).toBeInTheDocument();

    // Check if the "Go Back" button is rendered
    expect(screen.getByRole('button', { name: /Go Back/i })).toBeInTheDocument();
  });

  // Test case: Navigation functionality
  it('navigates to the home page when "Go Back" button is clicked', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({
      push: mockPush,
    }));

    render(<ErrorPage />);

    // Simulate a click on the "Go Back" button
    fireEvent.click(screen.getByRole('button', { name: /Go Back/i }));

    // Check if the router.push method was called with the correct argument
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  // Test case: Styling
  it('applies the correct CSS classes', () => {
    render(<ErrorPage />);

    // Check if the container has the correct class
    expect(screen.getByRole('heading', { name: /Error/i }).parentElement).toHaveClass('mockContainer');

    // Check if the heading has the correct class
    expect(screen.getByRole('heading', { name: /Error/i })).toHaveClass('mockHeading');

    // Check if the description has the correct class
    expect(screen.getByText('Sorry, something went wrong.')).toHaveClass('mockDescription');

    // Check if the button has the correct class
    expect(screen.getByRole('button', { name: /Go Back/i })).toHaveClass('mockButton');
  });
});