import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SavedBreedingList from "@/app/(pals)/saved-combinations/components/SavedBreedingList";
import '@testing-library/jest-dom';
import SearchBar from "@/app/components/SearchBar";

// Mock the SavedBreedingCard and SearchBar components
jest.mock("@/app/(pals)/saved-combinations/components/SavedBreedingCard", () => jest.fn(() => <div>SavedBreedingCard Mock</div>));
jest.mock("@/app/components/SearchBar", () => jest.fn(({ onSearch, value }) => (
  <input
    type="text"
    placeholder="Search"
    value={value}
    onChange={(e) => onSearch(e.target.value)}
    aria-label="Search breeding combinations"
  />
)));

describe("SavedBreedingList Component", () => {
    const userId = "user123";
    const breedingCombos = [
      { breeding_combo_id: "combo1", parent1: { name: "Parent1" }, parent2: { name: "Parent2" } },
      { breeding_combo_id: "combo2", parent1: { name: "Alpha" }, parent2: { name: "Beta" } },
    ];
    const searchTerm = "Parent1";
    const setSearchTerm = jest.fn();
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Test case to render the component
    it("renders the SavedBreedingList component correctly", () => {
      render(
        <SavedBreedingList
          userId={userId}
          breedingCombos={breedingCombos}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      );
  
      // Check if the SearchBar is displayed
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  
      // Check if the SavedBreedingCard is displayed
      expect(screen.getAllByText("SavedBreedingCard Mock")).toHaveLength(1);
    });
  
    // Test case to handle search term filtering
    it("filters breeding combinations based on search term", () => {
      const { rerender } = render(
        <SavedBreedingList
          userId={userId}
          breedingCombos={breedingCombos}
          searchTerm=""
          setSearchTerm={setSearchTerm}
        />
      );
  
      // Simulate typing in the search bar
      fireEvent.change(screen.getByPlaceholderText("Search"), { target: { value: "Alpha" } });
  
      // Check if setSearchTerm is called with the correct value
      expect(setSearchTerm).toHaveBeenCalledWith("Alpha");
  
      // Re-render with updated search term
      rerender(
        <SavedBreedingList
          userId={userId}
          breedingCombos={breedingCombos}
          searchTerm="Alpha"
          setSearchTerm={setSearchTerm}
        />
      );
  
      // Check if the correct SavedBreedingCard is displayed
      expect(screen.getAllByText("SavedBreedingCard Mock")).toHaveLength(1);
    });
  
    // Test case to display a message when no breeding combinations match the search term
    it("displays a message when no breeding combinations match the search term", () => {
      render(
        <SavedBreedingList
          userId={userId}
          breedingCombos={breedingCombos}
          searchTerm="NonExistent"
          setSearchTerm={setSearchTerm}
        />
      );
  
      // Check if the no combinations saved message is displayed
      expect(screen.getByText("No combinations saved.")).toBeInTheDocument();
    });
  });