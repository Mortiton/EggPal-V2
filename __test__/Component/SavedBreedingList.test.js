import React from "react";
import { render, screen } from "@testing-library/react";
import SavedBreedingList from "@/app/(pals)/saved-combinations/components/SavedBreedingList";

// Mock the SavedBreedingCard component
jest.mock("@/app/(pals)/saved-combinations/components/SavedBreedingCard", () => {
  return function MockSavedBreedingCard({ breedingComboId, parent1, parent2 }) {
    return (
      <div data-testid={`breeding-card-${breedingComboId}`}>
        {parent1} + {parent2}
      </div>
    );
  };
});

describe("SavedBreedingList", () => {
  // Test case for when the list is empty
  it("displays a message when there are no breeding combinations", () => {
    render(<SavedBreedingList />);

    // Check if the "No combinations saved" message is present
    expect(screen.getByText("No combinations saved.")).toBeInTheDocument();
  });

  // Test case for when the list has breeding combinations
  it("renders breeding cards for each combination", () => {
    const mockBreedingCombos = [
      {
        id: 1,
        breedingComboId: "abc123",
        parent1: "Lamball",
        parent2: "Cattiva",
      },
      {
        id: 2,
        breedingComboId: "def456",
        parent1: "Depresso",
        parent2: "Fuack",
      },
    ];

    render(<SavedBreedingList breedingCombos={mockBreedingCombos} />);

    // Check if the breeding cards are rendered
    expect(screen.getByTestId("breeding-card-abc123")).toBeInTheDocument();
    expect(screen.getByTestId("breeding-card-def456")).toBeInTheDocument();

    // Verify the content of the breeding cards
    expect(screen.getByText("Lamball + Cattiva")).toBeInTheDocument();
    expect(screen.getByText("Depresso + Fuack")).toBeInTheDocument();
  });

  // Test case to ensure the list has the correct ARIA role
  it("has the correct ARIA role for the breeding list", () => {
    const mockBreedingCombos = [
      {
        id: 1,
        breedingComboId: "abc123",
        parent1: "Lamball",
        parent2: "Cattiva",
      },
    ];

    render(<SavedBreedingList breedingCombos={mockBreedingCombos} />);

    // Check if the list has the correct ARIA role
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
