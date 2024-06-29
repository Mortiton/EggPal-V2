import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypeDropdown from '@/app/components/TypeDropDown';


describe('TypeDropdown component', () => {
  const types = [
    { name: "neutral" },
    { name: "dark" },
    { name: "dragon" },
    { name: "electric" },
    { name: "fire" },
    { name: "grass" },
    { name: "ground" },
    { name: "ice" },
    { name: "water" },
  ];

  test('renders the dropdown button', () => {
    render(<TypeDropdown types={types} onSelectType={() => {}} />);
    const button = screen.getByRole('button', { name: /Element Type/i });
    expect(button).toBeInTheDocument();
  });

  test('toggles the dropdown when button is clicked', () => {
    render(<TypeDropdown types={types} onSelectType={() => {}} />);
    const button = screen.getByRole('button', { name: /Element Type/i });

    // Open dropdown
    fireEvent.click(button);
    const dropdownContent = screen.getByRole('listbox', { name: /Element Type/i });
    expect(dropdownContent).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(button);
    expect(dropdownContent).not.toBeInTheDocument();
  });

  test('closes the dropdown when clicking outside', () => {
    render(<TypeDropdown types={types} onSelectType={() => {}} />);
    const button = screen.getByRole('button', { name: /Element Type/i });

    // Open dropdown
    fireEvent.click(button);
    const dropdownContent = screen.getByRole('listbox', { name: /Element Type/i });
    expect(dropdownContent).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document);
    waitFor(() => expect(dropdownContent).not.toBeInTheDocument());
  });

  test('calls onSelectType with the correct type when an option is clicked', () => {
    const mockOnSelectType = jest.fn();
    render(<TypeDropdown types={types} onSelectType={mockOnSelectType} />);
    const button = screen.getByRole('button', { name: /Element Type/i });

    // Open dropdown
    fireEvent.click(button);

    // Click on an option
    const option = screen.getByRole('option', { name: /fire/i });
    fireEvent.click(option);
    expect(mockOnSelectType).toHaveBeenCalledWith('fire');
  });

  test('closes the dropdown when an option is clicked', () => {
    render(<TypeDropdown types={types} onSelectType={() => {}} />);
    const button = screen.getByRole('button', { name: /Element Type/i });

    // Open dropdown
    fireEvent.click(button);

    // Click on an option
    const option = screen.getByRole('option', { name: /fire/i });
    fireEvent.click(option);
    waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  test('handles Escape key to close the dropdown', () => {
    render(<TypeDropdown types={types} onSelectType={() => {}} />);
    const button = screen.getByRole('button', { name: /Element Type/i });

    // Open dropdown
    fireEvent.click(button);

    // Press Escape
    fireEvent.keyDown(button, { key: 'Escape' });
    waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });
});
