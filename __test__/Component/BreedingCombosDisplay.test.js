import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BreedingCombosDisplay from "@/app/(pals)/saved-combinations/components/BreedingCombosDisplay";
import { SavedCombinationsProvider, useSavedCombinations } from "@/app/context/SavedCombinationsContext";
import "@testing-library/jest-dom";

// Mock the child components
jest.mock("@/app/(pals)/saved-combinations/components/ChildButton", () =>
  jest.fn(({ child, onClick, isSelected }) => (
    <button onClick={() => onClick(child)} aria-pressed={isSelected}>
      {child}
    </button>
  ))
);

jest.mock("@/app/(pals)/saved-combinations/components/SavedBreedingList", () =>
  jest.fn(({ breedingCombos }) => (
    <div>SavedBreedingList Mock: {breedingCombos.length} combos</div>
  ))
);

// Mock the SavedCombinationsContext
jest.mock("@/app/context/SavedCombinationsContext", () => ({
  useSavedCombinations: jest.fn(),
  SavedCombinationsProvider: ({ children }) => <div>{children}</div>,
}));

describe("BreedingCombosDisplay Component", () => {
  // Sample data for testing
  const mockSavedCombinations = [
    { breedingComboId: "combo1", child: { name: "Child1" }, parent1: "Parent1", parent2: "Parent2" },
    { breedingComboId: "combo2", child: { name: "Child1" }, parent1: "Parent3", parent2: "Parent4" },
    { breedingComboId: "combo3", child: { name: "Child2" }, parent1: "Parent5", parent2: "Parent6" },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Set up the default mock return value for useSavedCombinations
    useSavedCombinations.mockReturnValue({
      savedCombinations: mockSavedCombinations,
      isLoading: false,
    });
  });

  // Test: Verify correct rendering with saved combinations
  it("renders the BreedingCombosDisplay component correctly with saved combinations", () => {
    render(<BreedingCombosDisplay />);

    // Check for the presence of the instruction text
    expect(screen.getByText("Click on a pal to view its saved breeding combinations.")).toBeInTheDocument();
    // Verify that child buttons are rendered
    expect(screen.getByText("Child1")).toBeInTheDocument();
    expect(screen.getByText("Child2")).toBeInTheDocument();
  });

  // Test: Verify message display when no combinations are saved
  it("renders a message when no saved combinations exist", () => {
    // Mock the context to return an empty array of saved combinations
    useSavedCombinations.mockReturnValue({
      savedCombinations: [],
      isLoading: false,
    });

    render(<BreedingCombosDisplay />);

    // Check for the presence of the "no saved combinations" message
    expect(screen.getByText("No saved breeding combinations found. Click the heart icon on breeding combinations to save them here.")).toBeInTheDocument();
  });

  // Test: Verify correct behaviour when clicking a child button
  it("handles child button click correctly", async () => {
    render(<BreedingCombosDisplay />);

    // Click the "Child1" button
    fireEvent.click(screen.getByText("Child1"));

    // Wait for and check the presence of Child1's breeding combinations
    await waitFor(() => {
      expect(screen.getByText("Breeding combinations for Child1")).toBeInTheDocument();
      expect(screen.getByText("SavedBreedingList Mock: 2 combos")).toBeInTheDocument();
    });

    // Click the "Child1" button again to deselect
    fireEvent.click(screen.getByText("Child1"));

    // Wait for and check the absence of Child1's breeding combinations
    await waitFor(() => {
      expect(screen.queryByText("Breeding combinations for Child1")).not.toBeInTheDocument();
      expect(screen.queryByText("SavedBreedingList Mock: 2 combos")).not.toBeInTheDocument();
    });
  });

  // Test: Verify correct behaviour when switching between child buttons
  it("handles switching between child buttons correctly", async () => {
    render(<BreedingCombosDisplay />);

    // Click the "Child1" button
    fireEvent.click(screen.getByText("Child1"));

    // Wait for and check the presence of Child1's breeding combinations
    await waitFor(() => {
      expect(screen.getByText("Breeding combinations for Child1")).toBeInTheDocument();
      expect(screen.getByText("SavedBreedingList Mock: 2 combos")).toBeInTheDocument();
    });

    // Click the "Child2" button
    fireEvent.click(screen.getByText("Child2"));

    // Wait for and check the presence of Child2's breeding combinations
    await waitFor(() => {
      expect(screen.getByText("Breeding combinations for Child2")).toBeInTheDocument();
      expect(screen.getByText("SavedBreedingList Mock: 1 combos")).toBeInTheDocument();
    });

    // Check that Child1's breeding combinations are no longer displayed
    expect(screen.queryByText("Breeding combinations for Child1")).not.toBeInTheDocument();
  });
});