import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypeDropdown from '@/app/components/TypeDropDown';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

describe('TypeDropdown', () => {
  const mockTypes = [
    { icon_name: 'type1', icon_url: '/type1.png' },
    { icon_name: 'type2', icon_url: '/type2.png' },
  ];
  const mockOnSelectType = jest.fn();

  it('renders the dropdown button', () => {
    render(<TypeDropdown types={mockTypes} onSelectType={mockOnSelectType} />);
    expect(screen.getByRole('button', { name: 'Element Type' })).toBeInTheDocument();
  });

  it('opens the dropdown when button is clicked', () => {
    render(<TypeDropdown types={mockTypes} onSelectType={mockOnSelectType} />);
    const button = screen.getByRole('button', { name: 'Element Type' });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes the dropdown when an option is selected', () => {
    render(<TypeDropdown types={mockTypes} onSelectType={mockOnSelectType} />);
    const button = screen.getByRole('button', { name: 'Element Type' });
    fireEvent.click(button);
    const option = screen.getByRole('option', { name: 'type1' });
    fireEvent.click(option);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onSelectType with the correct type when an option is selected', () => {
    render(<TypeDropdown types={mockTypes} onSelectType={mockOnSelectType} />);
    const button = screen.getByRole('button', { name: 'Element Type' });
    fireEvent.click(button);
    const option = screen.getByRole('option', { name: 'type1' });
    fireEvent.click(option);
    expect(mockOnSelectType).toHaveBeenCalledWith('type1');
  });

  it('closes the dropdown when Escape key is pressed', () => {
    render(<TypeDropdown types={mockTypes} onSelectType={mockOnSelectType} />);
    const button = screen.getByRole('button', { name: 'Element Type' });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(button, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});