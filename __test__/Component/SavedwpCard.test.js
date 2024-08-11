import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SavedBreedingCard from "@/app/(pals)/saved-combinations/components/SavedBreedingCard";
import "@testing-library/jest-dom";
import { removeSavedBreedingCombo } from "@/app/(pals)/saved-combinations/actions";

// Mock the removeSavedBreedingCombo action
jest.mock("@/app/(pals)/saved-combinations/actions", () => ({
  removeSavedBreedingCombo: jest.fn(),
}));

describe("SavedBreedingCard Component", () => {
  const userId = "user123";
  const breedingComboId = "combo123";
  const parent1 = { name: "Parent1", image: "/images/parent1.png" };
  const parent2 = { name: "Parent2", image: "/images/parent2.png" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the SavedBreedingCard component correctly", () => {
    render(
      <SavedBreedingCard
        userId={userId}
        breedingComboId={breedingComboId}
        parent1={parent1}
        parent2={parent2}
      />
    );

    // Check if the parent names and images are displayed
    expect(screen.getByAltText("Parent1")).toBeInTheDocument();
    expect(screen.getByAltText("Parent2")).toBeInTheDocument();
    expect(screen.getByText("Parent1")).toBeInTheDocument();
    expect(screen.getByText("Parent2")).toBeInTheDocument();

    // Check if the plus icon and remove button are displayed
    expect(screen.getByLabelText("plus")).toBeInTheDocument();
    expect(screen.getByLabelText("remove")).toBeInTheDocument();
  });

  // Test case to handle remove button click
  it("handles remove button click correctly", async () => {
    render(
      <SavedBreedingCard
        userId={userId}
        breedingComboId={breedingComboId}
        parent1={parent1}
        parent2={parent2}
      />
    );

    // Click the remove button
    fireEvent.click(screen.getByLabelText("remove"));

    // Expect the removeSavedBreedingCombo function to be called with the correct arguments
    expect(removeSavedBreedingCombo).toHaveBeenCalledWith(
      userId,
      breedingComboId
    );
  });

  // Test case to check links to parent pages
  it("links to the correct parent pages", () => {
    render(
      <SavedBreedingCard
        userId={userId}
        breedingComboId={breedingComboId}
        parent1={parent1}
        parent2={parent2}
      />
    );

    // Check if the links to the parent pages are correct
    expect(screen.getByLabelText("Link to Parent1")).toHaveAttribute(
      "href",
      `/pal/${encodeURIComponent(parent1.name)}`
    );
    expect(screen.getByLabelText("Link to Parent2")).toHaveAttribute(
      "href",
      `/pal/${encodeURIComponent(parent2.name)}`
    );
  });
});
