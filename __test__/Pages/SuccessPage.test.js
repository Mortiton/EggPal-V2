import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SuccessPage from '@/app/success/page';


// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock the CSS module
jest.mock('@/app/success/page.module.css', () => ({
  container: 'mockedContainer',
  heading: 'mockedHeading',
  description: 'mockedDescription',
  button: 'mockedButton',
}));

describe('SuccessPage', () => {
  let mockRouter;
  let mockSearchParams;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    mockSearchParams = new Map();
    require('next/navigation').useRouter.mockReturnValue(mockRouter);
    require('next/navigation').useSearchParams.mockReturnValue({
      get: (key) => mockSearchParams.get(key),
    });
  });

  it('renders default title and description when no search params are provided', () => {
    render(<SuccessPage />);
    expect(screen.getByRole('heading')).toHaveTextContent('Success');
    expect(screen.getByText('Operation completed successfully.')).toBeInTheDocument();
  });

  it('renders custom title and description from search params', () => {
    mockSearchParams.set('title', 'Custom Title');
    mockSearchParams.set('description', 'Custom description');
    render(<SuccessPage />);
    expect(screen.getByRole('heading')).toHaveTextContent('Custom Title');
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('redirects to home page when button is clicked', () => {
    render(<SuccessPage />);
    const button = screen.getByRole('button', { name: 'Return to Home' });
    fireEvent.click(button);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('applies correct CSS classes', () => {
    render(<SuccessPage />);
    expect(screen.getByRole('heading')).toHaveClass('mockedHeading');
    expect(screen.getByText('Operation completed successfully.')).toHaveClass('mockedDescription');
    expect(screen.getByRole('button')).toHaveClass('mockedButton');
  });
});