import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from '@/app/error/page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the CSS module
jest.mock('@/app/error/styles/page.module.css', () => ({
  container: 'mockedContainer',
  heading: 'mockedHeading',
  description: 'mockedDescription',
  button: 'mockedButton',
}));

describe('ErrorPage', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    require('next/navigation').useRouter.mockReturnValue(mockRouter);
  });

  it('renders the error page with correct elements', () => {
    render(<ErrorPage />);
    
    expect(screen.getByRole('heading', { name: /Error/i })).toBeInTheDocument();
    expect(screen.getByText(/Sorry, something went wrong./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Back/i })).toBeInTheDocument();
  });

  it('navigates to home page when "Go Back" button is clicked', () => {
    render(<ErrorPage />);
    
    const goBackButton = screen.getByRole('button', { name: /Go Back/i });
    fireEvent.click(goBackButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ErrorPage />);
    
    expect(container.firstChild).toHaveClass('mockedContainer');
    expect(screen.getByRole('heading', { name: /Error/i })).toHaveClass('mockedHeading');
    expect(screen.getByText(/Sorry, something went wrong./i)).toHaveClass('mockedDescription');
    expect(screen.getByRole('button', { name: /Go Back/i })).toHaveClass('mockedButton');
  });
});