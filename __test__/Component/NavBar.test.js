import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBar from "@/app/components/NavBar";

// Mock the next/link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the BurgerMenu component
jest.mock("@/app/components/BurgerMenu", () => {
  return function MockBurgerMenu({ isAuthenticated }) {
    return <div data-testid="burger-menu">BurgerMenu</div>;
  };
});

// Mock the getSession function
jest.mock("@/app/services/authService", () => ({
  getSession: jest.fn(),
}));

// Mock the redirect function
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock the CSS module
jest.mock("@/app/components/styles/NavBar.module.css", () => ({
  navbar: "mockNavbar",
  title: "mockTitle",
  navLinks: "mockNavLinks",
  link: "mockLink",
  logoutBtn: "mockLogoutBtn",
}));

describe("NavBar Component", () => {
  // Helper function to render the NavBar with a specific authentication state
  const renderNavBar = async (isAuthenticated) => {
    const { getSession } = require("@/app/services/authService");
    getSession.mockResolvedValue(isAuthenticated ? { user: {} } : null);
    const NavBarComponent = await NavBar();
    render(NavBarComponent);
  };

  it("renders the navbar with the correct title", async () => {
    await renderNavBar(false);
    
    // Check if the title is present and links to the home page
    const titleLink = screen.getByRole("link", { name: "EggPal" });
    expect(titleLink).toHaveTextContent("EggPal");
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("renders login and signup links when user is not authenticated", async () => {
    await renderNavBar(false);
    
    // Check for login and signup links
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Signup" })).toHaveAttribute("href", "/signup");
  });

  it("renders authenticated user links when user is logged in", async () => {
    await renderNavBar(true);
    
    // Check for authenticated user links
    expect(screen.getByRole("link", { name: "Favourite Pals" })).toHaveAttribute("href", "/favourite-pals");
    expect(screen.getByRole("link", { name: "Saved Combinations" })).toHaveAttribute("href", "/saved-combinations");
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
    
    // Check for logout button
    expect(screen.getByRole("menuitem", { name: "logout" })).toBeInTheDocument();
  });

  it("renders the BurgerMenu component", async () => {
    await renderNavBar(false);
    
    // Check if BurgerMenu is rendered
    expect(screen.getByTestId("burger-menu")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    // Ensure the component has the correct display name
    expect(NavBar.displayName).toBe("NavBar");
  });
});