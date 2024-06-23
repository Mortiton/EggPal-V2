import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended DOM matchers like toBeInTheDocument
import PalList from '@/app/components/PalList'; // Adjust the import according to your file structure

//Mocking test pals
const mockPals = [
  {
    id: 1,
    name: 'Test Pal 1',
    type1: 'fire',
    type2: 'water',
    strength: 5,
    speed: 3,
    intelligence: 4
  },
  {
    id: 2,
    name: 'Test Pal 2',
    type1: 'grass',
    type2: null,
    strength: 7,
    speed: 2,
    intelligence: 6
  }
];

//Mock the PalCard component
jest.mock('@/app/components/PalCard', () => ({ pal }) => (
  <div data-testid={`pal-card-${pal.id}`}>
    {pal.name}
  </div>
));

//Mock the Searchbar component
jest.mock('@/app/components/SearchBar', () => ({ onSearch }) => (
  <input
    data-testid="search-bar"
    type="text"
    onChange={(e) => onSearch(e.target.value)}
  />
));

//Mock the TypeDropDown component
jest.mock('@/app/components/TypeDropDown', () => ({ types, onSelectType }) => (
  <select data-testid="type-dropdown" onChange={(e) => onSelectType(e.target.value)}>
    <option value="">All</option>
    {types.map((type) => (
      <option key={type.name} value={type.name}>
        {type.name}
      </option>
    ))}
  </select>
));

//Mock the WorkDropDown component
jest.mock('@/app/components/WorkDropDown', () => ({ work, onSelectWork }) => (
  <select data-testid="work-dropdown" onChange={(e) => onSelectWork(e.target.value)}>
    <option value="">All</option>
    {work.map((workItem) => (
      <option key={workItem.name} value={workItem.name}>
        {workItem.name}
      </option>
    ))}
  </select>
));

describe('PalList component', () => {
  test('renders pal list correctly', () => {
    render(<PalList pals={mockPals} />);

    // Check if the pals are rendered
    expect(screen.getByTestId('pal-card-1')).toHaveTextContent('Test Pal 1');
    expect(screen.getByTestId('pal-card-2')).toHaveTextContent('Test Pal 2');
  });

  test('filters pals based on search query', () => {
    render(<PalList pals={mockPals} />);

    const searchBar = screen.getByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'Test Pal 1' } });

    // Check if the filtered pal is rendered
    expect(screen.getByTestId('pal-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('pal-card-2')).not.toBeInTheDocument();
  });

  test('filters pals based on selected type', () => {
    render(<PalList pals={mockPals} />);

    const typeDropdown = screen.getByTestId('type-dropdown');
    fireEvent.change(typeDropdown, { target: { value: 'grass' } });

    // Check if the filtered pal is rendered
    expect(screen.getByTestId('pal-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('pal-card-1')).not.toBeInTheDocument();
  });

  test('filters pals based on selected work attribute', () => {
    render(<PalList pals={mockPals} />);

    const workDropdown = screen.getByTestId('work-dropdown');
    fireEvent.change(workDropdown, { target: { value: 'strength' } });

    // Check if the filtered pals are rendered based on work attribute
    expect(screen.getByTestId('pal-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('pal-card-2')).toBeInTheDocument();
  });

  test('shows scroll to top button when scrolled down', () => {
    render(<PalList pals={mockPals} />);

    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 500 } });

    // Check if the scroll to top button is displayed
    expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument();
  });
});
