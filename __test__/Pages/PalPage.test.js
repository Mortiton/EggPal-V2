import React from "react";
import { render, screen } from "@testing-library/react";
import PalPage from "@/app/(pals)/pal/[palId]/page";
import { getPals, getBreedingCombinations } from "@/app/lib/api/supabase";
import { getUser } from "@/app/utils/getUser";

// Mock the database functions
jest.mock("@/app/lib/api/supabase", () => ({
  getPals: jest.fn(),
  getBreedingCombinations: jest.fn(),
}));

// Mock the getUser function
jest.mock("@/app/utils/getUser", () => ({
  getUser: jest.fn(),
}));

// Mock the PalDetailsDisplay component
jest.mock("@/app/(pals)/pal/[palId]/components/PalDetailsDisplay", () => {
  return function MockedPalDetailsDisplay({ pal, breedingCombos, user }) {
    return (
      <div data-testid="pal-details-display">Mocked PalDetailsDisplay</div>
    );
  };
});

// Mock the CSS module
jest.mock("./page.module.css", () => ({
  mainContainer: "mockedMainContainer",
}));

describe("PalPage", () => {
  const mockPal = { id: "1", name: "TestPal" };
  const mockBreedingCombos = [
    { id: "1", parent1: "ParentPal1", parent2: "ParentPal2" },
  ];
  const mockUser = { id: "user1", name: "Test User" };

  beforeEach(() => {
    getPals.mockResolvedValue([mockPal]);
    getBreedingCombinations.mockResolvedValue(mockBreedingCombos);
    getUser.mockResolvedValue(mockUser);
  });

  it("renders PalDetailsDisplay when pal data is available", async () => {
    const params = { palId: "1" };
    const { container } = render(await PalPage({ params }));

    expect(screen.getByTestId("pal-details-display")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("mockedMainContainer");
  });

  it("displays error message when no pal data is available", async () => {
    getPals.mockResolvedValue([]);
    const params = { palId: "999" };
    render(await PalPage({ params }));

    expect(
      screen.getByText("No Pal information available.")
    ).toBeInTheDocument();
  });

  it("calls getPals with correct palId", async () => {
    const params = { palId: "1" };
    await PalPage({ params });

    expect(getPals).toHaveBeenCalledWith(["1"]);
  });

  it("calls getBreedingCombinations with correct pal name", async () => {
    const params = { palId: "1" };
    await PalPage({ params });

    expect(getBreedingCombinations).toHaveBeenCalledWith("TestPal");
  });

  it("calls getUser to fetch user data", async () => {
    const params = { palId: "1" };
    await PalPage({ params });

    expect(getUser).toHaveBeenCalled();
  });
});
