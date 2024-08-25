import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BreedingList from '@/app/(pals)/pal/[palId]/components/BreedingList';
import SearchBar from '@/app/components/SearchBar';

// Mock the SearchBar component
jest.mock('@/app/components/SearchBar', () => {
  return jest.fn(({ onSearch }) => (
    <input
      data-testid="search-bar"
      onChange={(e) => onSearch(e.target.value)}
    />
  ));
});

// Mock the BreedingCard component
jest.mock('@/app/(pals)/pal/[palId]/components/BreedingCard', () => {
  return jest.fn(() => <div data-testid="breeding-card" />);
});

describe('BreedingList', () => {
  // Sample breeding combinations for testing
  const mockBreedingCombos = [
    { id: 1, parent1_name: 'Charmander', parent2_name: 'Squirtle' },
    { id: 2, parent1_name: 'Bulbasaur', parent2_name: 'Pikachu' },
    { id: 3, parent1_name: 'Eevee', parent2_name: 'Jigglypuff' },
  ];

  // Test case: Renders the component with breeding combinations
  it('renders the component with breeding combinations', () => {
    render(<BreedingList breedingCombos={mockBreedingCombos} />);
    
    // Verify that the search bar is rendered
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    
    // Verify that all breeding cards are rendered
    const breedingCards = screen.getAllByTestId('breeding-card');
    expect(breedingCards).toHaveLength(mockBreedingCombos.length);
  });

  // Test case: Filters breeding combinations based on search term
  it('filters breeding combinations based on search term', () => {
    render(<BreedingList breedingCombos={mockBreedingCombos} />);
    
    // Simulate user typing in the search bar
    const searchBar = screen.getByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'char' } });
    
    // Verify that only one breeding card is rendered (Charmander)
    const breedingCards = screen.getAllByTestId('breeding-card');
    expect(breedingCards).toHaveLength(1);
  });

  // Test case: Displays a message when no combinations are available
  it('displays a message when no combinations are available', () => {
    render(<BreedingList breedingCombos={[]} />);
    
    // Verify that the "no combinations" message is displayed
    expect(screen.getByText('No breeding combinations available.')).toBeInTheDocument();
  });

  // Test case: Handles case-insensitive search
  it('handles case-insensitive search', () => {
    render(<BreedingList breedingCombos={mockBreedingCombos} />);
    
    // Simulate user typing in the search bar with mixed case
    const searchBar = screen.getByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'eEvEe' } });
    
    // Verify that one breeding card is rendered (Eevee)
    const breedingCards = screen.getAllByTestId('breeding-card');
    expect(breedingCards).toHaveLength(1);
  });

  // Test case: Updates search results in real-time
  it('updates search results in real-time', () => {
    render(<BreedingList breedingCombos={mockBreedingCombos} />);
    
    const searchBar = screen.getByTestId('search-bar');
    
    // Simulate user typing 'e'
    fireEvent.change(searchBar, { target: { value: 'e' } });
    expect(screen.getAllByTestId('breeding-card')).toHaveLength(2); // Eevee and Squirtle
    
    // Simulate user typing 'ee'
    fireEvent.change(searchBar, { target: { value: 'ee' } });
    expect(screen.getAllByTestId('breeding-card')).toHaveLength(1); // Only Eevee
  });
});