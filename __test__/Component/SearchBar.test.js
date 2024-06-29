import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import SearchBar from '@/app/components/SearchBar'; 

describe('SearchBar component', () => {
  test('renders search bar correctly', () => {
    render(<SearchBar onSearch={() => {}} value="" />);

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText('Search Pals...');
    expect(searchInput).toBeInTheDocument();
  });

  test('calls onSearch function when user types', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} value="" />);

    // Simulate user typing in the search bar
    const searchInput = screen.getByPlaceholderText('Search Pals...');
    fireEvent.change(searchInput, { target: { value: 'Test Pal' } });

    // Check if the onSearch function is called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith('Test Pal');
  });

  test('sets the value of the search input', () => {
    render(<SearchBar onSearch={() => {}} value="Test Pal" />);

    // Check if the search input value is set correctly
    const searchInput = screen.getByPlaceholderText('Search Pals...');
    expect(searchInput.value).toBe('Test Pal');
  });
});
