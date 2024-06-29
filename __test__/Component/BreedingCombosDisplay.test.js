import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BreedingCombosDisplay from "@/app/(pals)/saved-combinations/components/BreedingCombosDisplay"; 
import "@testing-library/jest-dom";

// Mock the ChildButton and SavedBreedingList components
jest.mock("@/app/(pals)/saved-combinations/components/ChildButton", () =>
  jest.fn(({ child, onClick, isSelected }) => (
    <button onClick={() => onClick(child)} aria-pressed={isSelected}>
      {child}
    </button>
  ))
);

jest.mock("@/app/(pals)/saved-combinations/components/SavedBreedingList", () =>
  jest.fn(() => <div>SavedBreedingList Mock</div>)
);

describe("BreedingCombosDisplay Component", () => {
  const combos = {
    Child1: [{ id: "combo1", parent1: "Parent1", parent2: "Parent2" }],
    Child2: [{ id: "combo2", parent1: "Parent3", parent2: "Parent4" }],
  };
  const userId = "user123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the BreedingCombosDisplay component correctly", () => {
    render(<BreedingCombosDisplay combos={combos} userId={userId} />);

    // Check if the child buttons are displayed
    expect(screen.getByText("Child1")).toBeInTheDocument();
    expect(screen.getByText("Child2")).toBeInTheDocument();
  });

  // Test case to handle child button click
  it("handles child button click correctly", () => {
    render(<BreedingCombosDisplay combos={combos} userId={userId} />);

    // Click the first child button
    fireEvent.click(screen.getByText("Child1"));

    // Check if the SavedBreedingList is displayed for the selected child
    expect(
      screen.getByText("Breeding combinations for Child1")
    ).toBeInTheDocument();
    expect(screen.getByText("SavedBreedingList Mock")).toBeInTheDocument();

    // Click the first child button again to deselect
    fireEvent.click(screen.getByText("Child1"));

    // Check if the SavedBreedingList is no longer displayed
    expect(
      screen.queryByText("Breeding combinations for Child1")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("SavedBreedingList Mock")
    ).not.toBeInTheDocument();
  });

  // Test case to handle switching between child buttons
  it("handles switching between child buttons correctly", () => {
    render(<BreedingCombosDisplay combos={combos} userId={userId} />);

    // Click the first child button
    fireEvent.click(screen.getByText("Child1"));

    // Check if the SavedBreedingList is displayed for the first child
    expect(
      screen.getByText("Breeding combinations for Child1")
    ).toBeInTheDocument();
    expect(screen.getByText("SavedBreedingList Mock")).toBeInTheDocument();

    // Click the second child button
    fireEvent.click(screen.getByText("Child2"));

    // Check if the SavedBreedingList is displayed for the second child
    expect(
      screen.getByText("Breeding combinations for Child2")
    ).toBeInTheDocument();
    expect(screen.getByText("SavedBreedingList Mock")).toBeInTheDocument();

    // Check if the first child's breeding list is no longer displayed
    expect(
      screen.queryByText("Breeding combinations for Child1")
    ).not.toBeInTheDocument();
  });
});
