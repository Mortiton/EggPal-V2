import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ErrorPage from '@/app/error/page'; 

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ErrorPage component', () => {
  /**
   * Test to verify that the ErrorPage component renders correctly.
   */
  test('renders the error page with the correct text', () => {
    render(<ErrorPage />);
    expect(screen.getByRole('heading', { name: /Error/i })).toBeInTheDocument();
    expect(screen.getByText(/Sorry, something went wrong./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Back/i })).toBeInTheDocument();
  });

  /**
   * Test to verify that clicking the "Go Back" button navigates the user back.
   */
  test('navigates back when "Go Back" button is clicked', () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    render(<ErrorPage />);
    fireEvent.click(screen.getByRole('button', { name: /Go Back/i }));
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
