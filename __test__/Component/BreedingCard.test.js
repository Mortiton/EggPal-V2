import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BreedingCard from '../../src/app/(pals)/pal/[palId]/components/BreedingCard';
import { SavedCombinationsProvider } from '@/app/context/SavedCombinationsContext';
import { toast } from 'react-toastify';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock SavedCombinationsContext
jest.mock('@/app/context/SavedCombinationsContext', () => ({
  useSavedCombinations: jest.fn(),
  SavedCombinationsProvider: ({ children }) => <div>{children}</div>,
}));

describe('BreedingCard', () => {
  const mockParent1 = { id: '1', name: 'Parent 1', image: '/parent1.png' };
  const mockParent2 = { id: '2', name: 'Parent 2', image: '/parent2.png' };
  const mockBreedingComboId = 'combo123';
  const mockAddCombination = jest.fn();
  const mockRemoveCombination = jest.fn();
  const mockUser = { id: 'user123' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the breeding card with correct parent information', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
        user={mockUser}
      />
    );

    expect(screen.getByText('Parent 1')).toBeInTheDocument();
    expect(screen.getByText('Parent 2')).toBeInTheDocument();
    expect(screen.getByAltText('Parent 1')).toHaveAttribute('src', '/parent1.png');
    expect(screen.getByAltText('Parent 2')).toHaveAttribute('src', '/parent2.png');
  });

  it('displays empty heart icon when combination is not saved', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
        user={mockUser}
      />
    );

    const heartIcon = screen.getByLabelText('Save combination');
    expect(heartIcon).toHaveAttribute('data-favourite', 'empty');
  });

  it('displays filled heart icon when combination is saved', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [{ breedingComboId: mockBreedingComboId }],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
        user={mockUser}
      />
    );

    const heartIcon = screen.getByLabelText('Remove from saved');
    expect(heartIcon).toHaveAttribute('data-favourite', 'filled');
  });

  it('calls addCombination when clicking the heart icon to save', async () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
        user={mockUser}
      />
    );

    const heartIcon = screen.getByLabelText('Save combination');
    fireEvent.click(heartIcon);

    await waitFor(() => {
      expect(mockAddCombination).toHaveBeenCalledWith(mockBreedingComboId);
    });
  });

  it('calls removeCombination when clicking the heart icon to unsave', async () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [{ breedingComboId: mockBreedingComboId }],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
        user={mockUser}
      />
    );

    const heartIcon = screen.getByLabelText('Remove from saved');
    fireEvent.click(heartIcon);

    await waitFor(() => {
      expect(mockRemoveCombination).toHaveBeenCalledWith(mockBreedingComboId);
    });
  });

  it('shows a toast message when trying to save without being logged in', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
        user={null}
      />
    );

    const heartIcon = screen.getByLabelText('Save combination');
    fireEvent.click(heartIcon);

    expect(toast.info).toHaveBeenCalledWith('Please log in to save breeding combinations.');
  });

  it('renders correct links for parent pals', () => {
    const { useSavedCombinations } = require('@/app/context/SavedCombinationsContext');
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      addCombination: mockAddCombination,
      removeCombination: mockRemoveCombination,
    });

    render(
      <BreedingCard
        parent1={mockParent1}
        parent2={mockParent2}
        breedingComboId={mockBreedingComboId}
        user={mockUser}
      />
    );

    const parent1Link = screen.getByRole('link', { name: 'Parent 1' });
    const parent2Link = screen.getByRole('link', { name: 'Parent 2' });

    expect(parent1Link).toHaveAttribute('href', '/pal/1');
    expect(parent2Link).toHaveAttribute('href', '/pal/2');
  });
});