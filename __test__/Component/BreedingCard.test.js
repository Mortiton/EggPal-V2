import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BreedingCard from '../../src/app/(pals)/pal/[palId]/components/BreedingCard';
import { SavedCombinationsProvider } from '@/app/context/SavedCombinationsContext';
import { toast } from 'react-toastify';

// Mock Next.js Image component to render as a standard img element
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// Mock Next.js Link component to render as a standard anchor element
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Mock react-toastify to track toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock SavedCombinationsContext to control its behaviour in tests
jest.mock('@/app/context/SavedCombinationsContext', () => ({
  useSavedCombinations: jest.fn(),
  SavedCombinationsProvider: ({ children }) => <div>{children}</div>,
}));

describe('BreedingCard', () => {
  // Mock data for parent pals
  const mockParent1 = {
    id: '1',
    name: 'Parent 1',
    image: '/parent1.png',
  };

  const mockParent2 = {
    id: '2',
    name: 'Parent 2',
    image: '/parent2.png',
  };

  const mockBreedingComboId = 'combo123';
  const mockAddCombination = jest.fn();
  const mockRemoveCombination = jest.fn();

  // Clear all mock functions before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test: Verify correct rendering of parent information
  it('renders the breeding card with correct parent information', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
      session: { user: { id: 'user123' } },
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
      />
    );

    // Check if parent names and images are correctly rendered
    expect(screen.getByText('Parent 1')).toBeInTheDocument();
    expect(screen.getByText('Parent 2')).toBeInTheDocument();
    expect(screen.getByAltText('Parent 1')).toHaveAttribute('src', '/parent1.png');
    expect(screen.getByAltText('Parent 2')).toHaveAttribute('src', '/parent2.png');
  });

  // Test: Verify empty heart icon for unsaved combination
  it('displays empty heart icon when combination is not saved', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
      session: { user: { id: 'user123' } },
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
      />
    );

    const heartIcon = screen.getByLabelText('Save combination');
    expect(heartIcon).toHaveAttribute('data-favorite', 'empty');
  });

  // Test: Verify filled heart icon for saved combination
  it('displays filled heart icon when combination is saved', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [{ breedingComboId: mockBreedingComboId }],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
      session: { user: { id: 'user123' } },
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
      />
    );

    const heartIcon = screen.getByLabelText('Remove from saved');
    expect(heartIcon).toHaveAttribute('data-favorite', 'filled');
  });

  // Test: Verify addCombination is called when saving
  it('calls addCombination when clicking the heart icon to save', async () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
      session: { user: { id: 'user123' } },
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
      />
    );

    const heartIcon = screen.getByLabelText('Save combination');
    fireEvent.click(heartIcon);

    expect(mockAddCombination).toHaveBeenCalledWith(mockBreedingComboId);
  });

  // Test: Verify removeCombination is called when unsaving
  it('calls removeCombination when clicking the heart icon to unsave', async () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [{ breedingComboId: mockBreedingComboId }],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
      session: { user: { id: 'user123' } },
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
      />
    );

    const heartIcon = screen.getByLabelText('Remove from saved');
    fireEvent.click(heartIcon);

    expect(mockRemoveCombination).toHaveBeenCalledWith(mockBreedingComboId);
  });

  // Test: Verify toast message for unauthenticated save attempt
  it('shows a toast message when trying to save without being logged in', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
      session: null,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
      />
    );

    const heartIcon = screen.getByLabelText('Save combination');
    fireEvent.click(heartIcon);

    expect(toast.info).toHaveBeenCalledWith('Please log in to save breeding combinations.');
  });

  // Test: Verify correct rendering of parent pal links
  it('renders correct links for parent pals', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
      session: { user: { id: 'user123' } },
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
      />
    );

    // Check if links to parent pals are correctly rendered
    const parent1Link = screen.getByRole('link', { name: 'Parent 1' });
    const parent2Link = screen.getByRole('link', { name: 'Parent 2' });

    expect(parent1Link).toHaveAttribute('href', '/pal/1');
    expect(parent2Link).toHaveAttribute('href', '/pal/2');
  });
});