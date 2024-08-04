import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import BreedingCard from "@/app/(pals)/pal/[palId]/components/BreedingCard"; 
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import { addSavedBreedingCombo, removeSavedBreedingCombo } from "@/app/(pals)/pal/[palId]/pal/id/actions";

// Mock the toast and action functions
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
  },
}));
jest.mock("@/app/(pals)/pal/[palName]/actions", () => ({
  addSavedBreedingCombo: jest.fn(),
  removeSavedBreedingCombo: jest.fn(),
}));

describe("BreedingCard Component", () => {
    const parent1 = { name: "Parent1", image: "/images/parent1.png" };
    const parent2 = { name: "Parent2", image: "/images/parent2.png" };
    const userId = "user123";
    const breedingComboId = "combo123";
    const savedBreedingCombos = [{ breeding_combo_id: "combo123" }];
    const user = { id: "user123" };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Test case to render the component
    it("renders the BreedingCard component correctly", () => {
      render(
        <BreedingCard
          parent1={parent1}
          parent2={parent2}
          userId={userId}
          breedingComboId={breedingComboId}
          savedBreedingCombos={savedBreedingCombos}
          user={user}
        />
      );
  
      // Check if both parents are displayed with correct images and names
      expect(screen.getByAltText("Parent1")).toBeInTheDocument();
      expect(screen.getByAltText("Parent2")).toBeInTheDocument();
      expect(screen.getByText("Parent1")).toBeInTheDocument();
      expect(screen.getByText("Parent2")).toBeInTheDocument();
  
      // Check if the favourite icon is filled
      expect(screen.getByLabelText("favourite")).toHaveAttribute("data-favorite", "filled");
    });
  
    // Test case to handle favourite toggle when the user is not logged in
    it("shows toast message if user is not logged in when toggling favourite", async () => {
      render(
        <BreedingCard
          parent1={parent1}
          parent2={parent2}
          userId={userId}
          breedingComboId={breedingComboId}
          savedBreedingCombos={savedBreedingCombos}
          user={null} // User not logged in
        />
      );
  
      // Click the favourite icon
      fireEvent.click(screen.getByLabelText("favourite"));
  
      // Expect the toast message to be shown
      expect(toast.info).toHaveBeenCalledWith('Please log in to save breeding combinations.');
    });
  
    // Test case to handle favourite toggle when the user is logged in
    it("toggles favourite state when user is logged in", async () => {
      render(
        <BreedingCard
          parent1={parent1}
          parent2={parent2}
          userId={userId}
          breedingComboId={breedingComboId}
          savedBreedingCombos={[]}
          user={user}
        />
      );
  
      // Click the favourite icon
      await act(async () => {
        fireEvent.click(screen.getByLabelText("favourite"));
      });
  
      // Expect the addSavedBreedingCombo to be called
      expect(addSavedBreedingCombo).toHaveBeenCalledWith(userId, breedingComboId);
  
      // Click the favourite icon again to unfavourite
      await act(async () => {
        fireEvent.click(screen.getByLabelText("favourite"));
      });
  
      // Expect the removeSavedBreedingCombo to be called
      expect(removeSavedBreedingCombo).toHaveBeenCalledWith(userId, breedingComboId);
    });
  
    // Test case to check if default images are used when parent images are not provided
    it("uses default images when parent images are not provided", () => {
      const defaultParent = { name: "DefaultParent" };
  
      render(
        <BreedingCard
          parent1={defaultParent}
          parent2={defaultParent}
          userId={userId}
          breedingComboId={breedingComboId}
          savedBreedingCombos={savedBreedingCombos}
          user={user}
        />
      );
  
      // Check if the default image is used
      const images = screen.getAllByRole("img");
      images.forEach(img => {
        expect(img).toHaveAttribute("src", "/images/default.png");
      });
  
      // Check if the alt text is correct
      expect(screen.getAllByAltText("DefaultParent").length).toBe(2);
    });
  });