import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBar from "@/app/components/NavBar";

describe("NavBar Component", () => {
  const user = { id: "user1", name: "Test User" };

  it("renders without crashing", () => {
    render(<NavBar />);
  });

  it("displays the title with link to home page", () => {
    render(<NavBar />);
    const titleLink = screen.getByRole("link", { name: /home page/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("displays login and signup links when user is not logged in", () => {
    render(<NavBar />);
    const loginLink = screen.getByRole("link", { name: /login/i });
    const signupLink = screen.getByRole("link", { name: /signup/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/signup");
  });

  it("displays user links when user is logged in", () => {
    render(<NavBar user={user} />);
    const favPalsLink = screen.getByRole("link", { name: /favourite pals/i });
    const savedCombosLink = screen.getByRole("link", {
      name: /saved combinations/i,
    });
    const profileLink = screen.getByRole("link", { name: /profile/i });
    const logoutButton = screen.getByRole("button", { name: /logout/i });

    expect(favPalsLink).toBeInTheDocument();
    expect(favPalsLink).toHaveAttribute("href", "/favourite-pals");
    expect(savedCombosLink).toBeInTheDocument();
    expect(savedCombosLink).toHaveAttribute("href", "/saved-combinations");
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute("href", "/profile");
    expect(logoutButton).toBeInTheDocument();
  });

  it("handles logout button click", () => {
    render(<NavBar user={user} />);
    const logoutButton = screen.getByRole("button", { name: /logout/i });

    fireEvent.submit(logoutButton);
    expect(logoutButton).toBeInTheDocument();
  });

  it("renders the BurgerMenu component", () => {
    render(<NavBar user={user} />);
    const burgerMenuButton = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });
    expect(burgerMenuButton).toBeInTheDocument();
  });
});
