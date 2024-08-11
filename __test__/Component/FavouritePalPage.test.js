import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import FavouritePalsPage from "@/app/(pals)/favourite-pals/page";
import { getSession } from "@/app/services/authService";
import { redirect } from "next/navigation";

// Mock dependencies
// Mock the authService to control the session
jest.mock("@/app/services/authService", () => ({
  getSession: jest.fn(),
}));

// Mock the Next.js redirect function
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock the FavouritePalsDisplay component
jest.mock("@/app/(pals)/favourite-pals/components/FavouritePalsDisplay", () => {
  return function MockFavouritePalsDisplay() {
    return (
      <div data-testid="favourite-pals-display">Favourite Pals Display</div>
    );
  };
});

// Mock the FavouritesProvider from the context
jest.mock("@/app/context/FavouritesContext", () => ({
  FavouritesProvider: ({ children }) => (
    <div data-testid="favourites-provider">{children}</div>
  ),
}));

// Test suite for FavouritePalsPage
describe("FavouritePalsPage", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case: Check if the page redirects to login when there's no session
  it("redirects to login page when there is no session", async () => {
    // Mock getSession to return null (no active session)
    getSession.mockResolvedValue(null);

    // Call the FavouritePalsPage function
    await FavouritePalsPage();

    // Expect that the redirect function was called with '/login'
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  // Test case: Check if the page renders correctly when there's an active session
  it("renders FavouritePalsDisplay when there is a session", async () => {
    // Mock getSession to return a valid session
    const mockSession = { user: { id: "123" } };
    getSession.mockResolvedValue(mockSession);

    // Render the FavouritePalsPage component
    const { getByTestId } = render(await FavouritePalsPage());

    // Check if the FavouritesProvider is rendered
    expect(getByTestId("favourites-provider")).toBeInTheDocument();
    // Check if the FavouritePalsDisplay is rendered
    expect(getByTestId("favourite-pals-display")).toBeInTheDocument();
  });
});
