import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import PalDetailsCard from "@/app/(pals)/pal/[palId]/components/PalDetailsCards";
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import { addFavoritePal, removeFavoritePal } from '@/app/(pals)/pal/[palId]/actions';
import WorkIcon from "@/app/components/WorkIcon"; // Adjust the import path accordingly

// Mock the toast and action functions
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
  },
}));

//Mock the action functions
jest.mock("@/app/(pals)/pal/[palName]/actions", () => ({
  addFavoritePal: jest.fn(),
  removeFavoritePal: jest.fn(),
}));

// Mock the WorkIcon component
jest.mock("@/app/components/WorkIcon", () => jest.fn(({ iconName }) => <div>{iconName}</div>));

describe("PalDetailsCard Component", () => {
    const pal = {
      id: "pal123",
      name: "Pal Name",
      description: "This is a test pal.",
      kindling: 1,
      watering: 0,
      planting: 3,
      generating_electricity: 2,
      handiwork: 0,
      gathering: 1,
      lumbering: 4,
      mining: 5,
      medicine_production: 0,
      cooling: 0,
      transporting: 2,
      farming: 3,
    };
    const user = { id: "user123" };
    const userFavorites = ["pal123"];
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Test case to render the component
    it("renders the PalDetailsCard component correctly", () => {
      render(
        <PalDetailsCard
          pal={pal}
          user={user}
          userFavorites={userFavorites}
        />
      );
  
      // Check if the pal's name, description, and image are displayed
      expect(screen.getByText("Pal Name")).toBeInTheDocument();
      expect(screen.getByText("This is a test pal.")).toBeInTheDocument();
      expect(screen.getByAltText("Pal Name")).toBeInTheDocument();
  
      // Check if the favourite icon is filled
      expect(screen.getByLabelText("Toggle Favourite")).toHaveAttribute("data-favourite", "filled");
  
      // Check if base skills are displayed
      const skills = ["kindling", "planting", "generating electricity", "gathering", "lumbering", "mining", "transporting", "farming"];
      skills.forEach(skill => {
        expect(screen.getByText((content, element) => element.textContent.replace(/_/g, " ") === skill)).toBeInTheDocument();
      });
    });
  
    // Test case for handling favourite toggle when the user is not logged in
    it("shows toast message if user is not logged in when toggling favourite", async () => {
      render(
        <PalDetailsCard
          pal={pal}
          user={null} // User not logged in
          userFavorites={[]}
        />
      );
  
      // Click the favourite icon
      fireEvent.click(screen.getByLabelText("Toggle Favourite"));
  
      // Expect the toast message to be shown
      expect(toast.info).toHaveBeenCalledWith('Please log in to favorite pals.');
    });
  
    // Test case for toggling favourite state when the user is logged in
    it("toggles favourite state when user is logged in", async () => {
      render(
        <PalDetailsCard
          pal={pal}
          user={user}
          userFavorites={[]}
        />
      );
  
      // Click the favourite icon
      await act(async () => {
        fireEvent.click(screen.getByLabelText("Toggle Favourite"));
      });
  
      // Expect the addFavoritePal to be called
      expect(addFavoritePal).toHaveBeenCalledWith(user.id, pal.id);
  
      // Click the favourite icon again to unfavourite
      await act(async () => {
        fireEvent.click(screen.getByLabelText("Toggle Favourite"));
      });
  
      // Expect the removeFavoritePal to be called
      expect(removeFavoritePal).toHaveBeenCalledWith(user.id, pal.id);
    });
  
    // Test case for displaying the correct state of the favourite icon
    it("displays the correct state of the favourite icon based on userFavorites", () => {
      render(
        <PalDetailsCard
          pal={pal}
          user={user}
          userFavorites={["pal456"]}
        />
      );
  
      // Expect the favourite icon to be empty
      expect(screen.getByLabelText("Toggle Favourite")).toHaveAttribute("data-favourite", "empty");
    });
  });