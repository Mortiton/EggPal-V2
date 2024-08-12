import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/app/components/SearchBar'; 

// Mock the CSS module to avoid issues with CSS imports during testing
jest.mock('./styles/SearchBar.module.css', () => ({
  searchContainer: 'mockSearchContainer',
  searchInput: 'mockSearchInput',
}));

describe('SearchBar', () => {
  // Test case to ensure the SearchBar renders correctly
  it('renders the search input field', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    // Verify that the search input is present and has the correct attributes
    const searchInput = screen.getByLabelText('Search for pals');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchInput).toHaveAttribute('name', 'filter');
    expect(searchInput).toHaveAttribute('placeholder', 'Search Pals...');
  });

  // Test case to check if the onSearch function is called when typing
  it('calls onSearch function when typing', () => {
    // Create a mock function to pass as onSearch prop
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Simulate user typing in the search input
    const searchInput = screen.getByLabelText('Search for pals');
    fireEvent.change(searchInput, { target: { value: 'Cattiva' } });
    
    // Verify that the onSearch function was called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith('Cattiva');
  });

  // Test case to ensure the search input displays the provided value
  it('displays the provided value in the search input', () => {
    const initialValue = 'Lamball';
    render(<SearchBar onSearch={() => {}} value={initialValue} />);
    
    // Check if the search input displays the initial value
    const searchInput = screen.getByLabelText('Search for pals');
    expect(searchInput).toHaveValue(initialValue);
  });

  // Test case to verify that the component has the correct display name
  it('has the correct display name', () => {
    expect(SearchBar.displayName).toBe('SearchBar');
  });

  // Test case to check if the component applies the correct CSS classes
  it('applies the correct CSS classes', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    // Verify that the container and input elements have the correct CSS classes
    const container = screen.getByLabelText('Search for pals').parentElement;
    expect(container).toHaveClass('mockSearchContainer');
    
    const searchInput = screen.getByLabelText('Search for pals');
    expect(searchInput).toHaveClass('mockSearchInput');
  });
});