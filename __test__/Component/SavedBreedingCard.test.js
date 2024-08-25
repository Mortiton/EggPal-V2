import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SavedBreedingCard from "@/app/(pals)/saved-combinations/components/SavedBreedingCard";

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));


// Mock FontAwesomeIcon component
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className, 'aria-label': ariaLabel }) => (
    <span className={className} aria-label={ariaLabel}>
      {icon.iconName}
    </span>
  ),
}));

//Mock the context
jest.mock('@/app/context/SavedCombinationsContext', () => ({
  useSavedCombinations: jest.fn(),
}));

describe('SavedBreedingCard', () => {
  // Define mock props to be used across multiple tests
  const mockProps = {
    breedingComboId: 'combo123',
    parent1: { id: 'pal1', name: 'Cattiva', image: '/images/cattiva.png' },
    parent2: { id: 'pal2', name: 'Lamball', image: '/images/lamball.png' },
  };

  const mockRemoveCombination = jest.fn();

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    require('@/app/context/SavedCombinationsContext').useSavedCombinations.mockReturnValue({
      removeCombination: mockRemoveCombination,
      session: { user: {} },
    });
  });

  it('renders the breeding card with correct parent information', () => {
    render(<SavedBreedingCard {...mockProps} />);

    // Verify that parent names are displayed correctly
    expect(screen.getByText('Cattiva')).toBeInTheDocument();
    expect(screen.getByText('Lamball')).toBeInTheDocument();

    // Check if parent images are rendered with the correct src attributes
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/images/cattiva.png');
    expect(images[1]).toHaveAttribute('src', '/images/lamball.png');

    // Ensure that links to parent pages are correct
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/pal/pal1');
    expect(links[1]).toHaveAttribute('href', '/pal/pal2');
  });

  it('calls removeCombination when remove button is clicked', () => {
    render(<SavedBreedingCard {...mockProps} />);

    // Simulate clicking the remove button
    const removeButton = screen.getByLabelText('remove');
    fireEvent.click(removeButton);

    // Verify that the removeCombination function is called with the correct ID
    expect(mockRemoveCombination).toHaveBeenCalledWith('combo123');
  });

  it('does not call removeCombination when session is not available', () => {
    // Mock the context to simulate no active session
    require('@/app/context/SavedCombinationsContext').useSavedCombinations.mockReturnValue({
      removeCombination: mockRemoveCombination,
      session: null,
    });

    render(<SavedBreedingCard {...mockProps} />);

    // Attempt to remove the combination
    const removeButton = screen.getByLabelText('remove');
    fireEvent.click(removeButton);

    // Ensure that removeCombination is not called when there's no active session
    expect(mockRemoveCombination).not.toHaveBeenCalled();
  });

  it('renders the plus icon between parent images', () => {
    render(<SavedBreedingCard {...mockProps} />);

    // Verify that the plus icon is present and has the correct class
    const plusIcon = screen.getByLabelText('plus');
    expect(plusIcon).toBeInTheDocument();
    expect(plusIcon).toHaveClass('plusIcon');
  });
});