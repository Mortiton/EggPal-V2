import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkDropDown from '@/app/components/WorkDropDown';

describe('WorkDropDown component', () => {
  const work = [
    { name: "kindling" },
    { name: "watering" },
    { name: "planting" },
    { name: "generating_electricity" },
    { name: "handiwork" },
    { name: "gathering" },
    { name: "lumbering" },
    { name: "mining" },
    { name: "medicine_production" },
    { name: "cooling" },
    { name: "transporting" },
    { name: "farming" },
  ];

  test('renders the dropdown button', () => {
    render(<WorkDropDown work={work} onSelectWork={() => {}} />);
    const button = screen.getByRole('button', { name: /Base Skills/i });
    expect(button).toBeInTheDocument();
  });

  test('toggles the dropdown when button is clicked', () => {
    render(<WorkDropDown work={work} onSelectWork={() => {}} />);
    const button = screen.getByRole('button', { name: /Base Skills/i });

    // Open dropdown
    fireEvent.click(button);
    const dropdownContent = screen.getByRole('listbox', { name: /Base Skills/i });
    expect(dropdownContent).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(button);
    expect(dropdownContent).not.toBeInTheDocument();
  });

  test('closes the dropdown when clicking outside', () => {
    render(<WorkDropDown work={work} onSelectWork={() => {}} />);
    const button = screen.getByRole('button', { name: /Base Skills/i });

    // Open dropdown
    fireEvent.click(button);
    const dropdownContent = screen.getByRole('listbox', { name: /Base Skills/i });
    expect(dropdownContent).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document);
    waitFor(() => expect(dropdownContent).not.toBeInTheDocument());
  });

  test('calls onSelectWork with the correct work when an option is clicked', () => {
    const mockOnSelectWork = jest.fn();
    render(<WorkDropDown work={work} onSelectWork={mockOnSelectWork} />);
    const button = screen.getByRole('button', { name: /Base Skills/i });

    // Open dropdown
    fireEvent.click(button);

    // Click on an option
    const option = screen.getByRole('option', { name: /planting/i });
    fireEvent.click(option);
    expect(mockOnSelectWork).toHaveBeenCalledWith('planting');
  });

  test('closes the dropdown when an option is clicked', () => {
    render(<WorkDropDown work={work} onSelectWork={() => {}} />);
    const button = screen.getByRole('button', { name: /Base Skills/i });

    // Open dropdown
    fireEvent.click(button);

    // Click on an option
    const option = screen.getByRole('option', { name: /planting/i });
    fireEvent.click(option);
    waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  test('handles Escape key to close the dropdown', () => {
    render(<WorkDropDown work={work} onSelectWork={() => {}} />);
    const button = screen.getByRole('button', { name: /Base Skills/i });

    // Open dropdown
    fireEvent.click(button);

    // Press Escape
    fireEvent.keyDown(button, { key: 'Escape' });
    waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });
});
