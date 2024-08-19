import React from 'react';
import { render } from '@testing-library/react';
import FavouritePalsPage from '@/app/(pals)/favourite-pals/page';w

// Mock the FavouritePalsDisplay component
jest.mock('@/app/(pals)/favourite-pals/components/FavouritePalsDisplay', () => {
  return function MockFavouritePalsDisplay() {
    return <div data-testid="mock-favourite-pals-display"></div>;
  };
});

describe('FavouritePalsPage', () => {
  it('renders FavouritePalsDisplay component', () => {
    const { getByTestId } = render(<FavouritePalsPage />);
    expect(getByTestId('mock-favourite-pals-display')).toBeInTheDocument();
  });
});