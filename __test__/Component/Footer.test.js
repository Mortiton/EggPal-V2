import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "@/app/components/Footer";

// Mock the CSS module to avoid issues with CSS imports in tests
jest.mock("./styles/Footer.module.css", () => ({
  footer: "mockFooterClass",
  copyrightText: "mockCopyrightClass",
  disclaimerText: "mockDisclaimerClass",
  footerNav: "mockFooterNavClass",
  link: "mockLinkClass",
}));

// Mock the Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Test suite for Footer component
describe("Footer Component", () => {
  // Test case: Check if the Footer renders correctly
  it("renders footer with correct content", () => {
    // Render the Footer component
    render(<Footer />);

    // Check if the copyright text is present
    expect(
      screen.getByText(/© 2024 EggPal. All rights reserved./)
    ).toBeInTheDocument();

    // Check if the email link is present and correct
    const emailLink = screen.getByText("support@eggpal.net");
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:support@eggpal.net");

    // Check if the disclaimer text is present
    expect(
      screen.getByText(/This website is not affiliated with Palworlds./)
    ).toBeInTheDocument();

    // Check if the Privacy Policy link is present and correct
    const privacyLink = screen.getByText("Privacy Policy");
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy-policy");

    // Check if the Terms of Service link is present and correct
    const termsLink = screen.getByText("Terms of Service");
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/terms-of-service");
  });

  // Test case: Check if the Footer has the correct aria-label
  it("has correct aria-label for footer navigation", () => {
    // Render the Footer component
    render(<Footer />);

    // Check if the navigation element has the correct aria-label
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Footer navigation");
  });

  // Test case: Check if the Footer component has the correct display name
  it("has correct display name", () => {
    expect(Footer.displayName).toBe("Footer");
  });
});
