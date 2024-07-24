import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BreedingList from "@/app/(pals)/pal/[palId]/components/BreedingList";
import BreedingCard from "@/app/(pals)/pal/[palId]/components/BreedingCard";
import SearchBar from "@/app/components/SearchBar";
import '@testing-library/jest-dom/';

// Mock the BreedingCard component
jest.mock("@/app/(pals)/pal/[palName]/components/BreedingCard", () => jest.fn(() => <div>BreedingCard Mock</div>));
// Mock the SearchBar component
jest.mock("@/app/components/SearchBar", () => jest.fn(({ onSearch }) => (
  <input
    type="text"
    aria-label="Search breeding combinations"
    onChange={(e) => onSearch(e.target.value)}
  />
)));

describe("BreedingList Component", () => {
  const breedingCombos = [
    { id: "1", parent1_name: "Parent1", parent1_image: "/images/parent1.png", parent2_name: "Parent2", parent2_image: "/images/parent2.png" },
    { id: "2", parent1_name: "Alpha", parent1_image: "/images/alpha.png", parent2_name: "Beta", parent2_image: "/images/beta.png" },
  ];
  const user = { id: "user123" };
  const savedBreedingCombos = [{ breeding_combo_id: "1" }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the BreedingList component correctly", () => {
    render(
      <BreedingList
        breedingCombos={breedingCombos}
        user={user}
        savedBreedingCombos={savedBreedingCombos}
      />
    );

    // Check if the search bar is displayed
    expect(screen.getByLabelText("Search breeding combinations")).toBeInTheDocument();

    // Check if the breeding cards are displayed
    expect(screen.getAllByText("BreedingCard Mock").length).toBe(2);
  });

  // Test case for filtering breeding combinations based on search term
  it("filters breeding combinations based on search term", () => {
    render(
      <BreedingList
        breedingCombos={breedingCombos}
        user={user}
        savedBreedingCombos={savedBreedingCombos}
      />
    );

    // Simulate typing in the search bar
    fireEvent.change(screen.getByLabelText("Search breeding combinations"), { target: { value: "Parent1" } });

    // Check if the filtered breeding card is displayed
    expect(screen.getAllByText("BreedingCard Mock").length).toBe(1);
  });

  // Test case for displaying message when no breeding combinations match the search term
  it("displays message when no breeding combinations match the search term", () => {
    render(
      <BreedingList
        breedingCombos={breedingCombos}
        user={user}
        savedBreedingCombos={savedBreedingCombos}
      />
    );

    // Simulate typing in the search bar
    fireEvent.change(screen.getByLabelText("Search breeding combinations"), { target: { value: "NonExistent" } });

    // Check if the no breeding combinations message is displayed
    expect(screen.getByText("No breeding combinations available.")).toBeInTheDocument();
  });
});