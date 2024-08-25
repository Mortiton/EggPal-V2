import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkDropDown from '@/app/components/WorkDropDown';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}));

describe('WorkDropDown', () => {
  const mockWork = [
    { icon_name: 'work1', icon_url: '/work1.png' },
    { icon_name: 'work2', icon_url: '/work2.png' },
  ];
  const mockOnSelectWork = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dropdown button', () => {
    render(<WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />);
    expect(screen.getByRole('button', { name: /base skills/i })).toBeInTheDocument();
  });

  it('opens the dropdown when button is clicked', () => {
    render(<WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />);
    const button = screen.getByRole('button', { name: /base skills/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes the dropdown when an option is selected', async () => {
    render(<WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />);
    const button = screen.getByRole('button', { name: /base skills/i });
    fireEvent.click(button);
    const option = screen.getByRole('option', { name: 'work1' });
    fireEvent.click(option);
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('calls onSelectWork with the correct work when an option is selected', () => {
    render(<WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />);
    const button = screen.getByRole('button', { name: /base skills/i });
    fireEvent.click(button);
    const option = screen.getByRole('option', { name: 'work1' });
    fireEvent.click(option);
    expect(mockOnSelectWork).toHaveBeenCalledWith('work1');
  });

  it('closes the dropdown when clicking outside', async () => {
    render(
      <div>
        <WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    const button = screen.getByRole('button', { name: /base skills/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('closes the dropdown when Escape key is pressed', async () => {
    render(<WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />);
    const button = screen.getByRole('button', { name: /base skills/i });
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(button, { key: 'Escape', code: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('renders work items with correct images', () => {
    render(<WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />);
    const button = screen.getByRole('button', { name: /base skills/i });
    fireEvent.click(button);
    mockWork.forEach(item => {
      const image = screen.getByAltText(item.icon_name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', item.icon_url);
    });
  });

  it('sets correct ARIA attributes', () => {
    render(<WorkDropDown work={mockWork} onSelectWork={mockOnSelectWork} />);
    const button = screen.getByRole('button', { name: /base skills/i });
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-labelledby', button.id);
  });
});