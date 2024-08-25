import React from 'react';
import { render, screen } from '@testing-library/react';
import SavedBreedingPage from '@/app/(pals)/saved-combinations/page';

// Mock the BreedingCombosDisplay component
jest.mock('@/app/(pals)/saved-combinations/components/BreedingCombosDisplay', () => {
  return function MockedBreedingCombosDisplay() {
    return <div data-testid="breeding-combos-display">Mocked BreedingCombosDisplay</div>;
  };
});

// Mock the CSS module
jest.mock('./page.module.css', () => ({
  container: 'mockedContainer',
  title: 'mockedTitle',
}));

describe('SavedBreedingPage', () => {
  it('renders the page title', () => {
    render(<SavedBreedingPage />);
    const titleElement = screen.getByText('Saved Breeding Combinations');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('mockedTitle');
  });

  it('renders the BreedingCombosDisplay component', () => {
    render(<SavedBreedingPage />);
    const breedingCombosDisplay = screen.getByTestId('breeding-combos-display');
    expect(breedingCombosDisplay).toBeInTheDocument();
  });

  it('applies the correct CSS class to the container', () => {
    const { container } = render(<SavedBreedingPage />);
    expect(container.firstChild).toHaveClass('mockedContainer');
  });

});