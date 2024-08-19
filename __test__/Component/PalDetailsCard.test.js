import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PalDetailsCard from "@/app/(pals)/pal/[palId]/components/PalDetailsCard";
import { toast } from "react-toastify";

// Mock the next/image component
jest.mock("next/image", () => ({ src, alt }) => <img src={src} alt={alt} />);

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    info: jest.fn(),
  },
}));

// Mock FontAwesomeIcon component
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, onClick, className, ...props }) => (
    <span
      onClick={onClick}
      className={`mock-icon ${className}`}
      data-prefix={icon[0]}
      data-icon={icon[1]}
      {...props}
    />
  ),
}));

// Sample pal data for testing
const mockPal = {
  name: "Test Pal",
  image_url: "/test-image.jpg",
  description: "A test pal description",
  skills: [
    {
      skill_name: "test_skill",
      skill_level: 5,
      skill_icon_url: "/test-icon.jpg",
    },
  ],
};

describe("PalDetailsCard Component", () => {
  // Test to ensure the component renders correctly
  it("renders the PalDetailsCard component with correct pal information", () => {
    render(
      <PalDetailsCard
        pal={mockPal}
        isFavourited={false}
        onToggleFavourite={() => {}}
        user={null}
      />
    );

    expect(screen.getByText("Test Pal")).toBeInTheDocument();
    expect(screen.getByText("A test pal description")).toBeInTheDocument();
    expect(screen.getByText("test skill:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  // Test favourite icon behaviour when user is not signed in
  it("displays a toast message when attempting to favourite without a user", () => {
    render(
      <PalDetailsCard
        pal={mockPal}
        isFavourited={false}
        onToggleFavourite={() => {}}
        user={null}
      />
    );

    const favouriteIcon = screen.getByLabelText("Toggle Favourite");
    fireEvent.click(favouriteIcon);

    expect(toast.info).toHaveBeenCalledWith(
      "Please sign in to favourite pals."
    );
  });

  // Test favourite icon behaviour when user is signed in
  it("calls onToggleFavourite when favourite icon is clicked with a valid user", () => {
    const mockToggleFavourite = jest.fn();
    render(
      <PalDetailsCard
        pal={mockPal}
        isFavourited={false}
        onToggleFavourite={mockToggleFavourite}
        user={{ id: '1', name: 'Test User' }}
      />
    );

    const favouriteIcon = screen.getByLabelText("Toggle Favourite");
    fireEvent.click(favouriteIcon);

    expect(mockToggleFavourite).toHaveBeenCalled();
  });

  // Test that the favourite icon changes based on the isFavourited prop
  it("displays the correct favourite icon based on isFavourited prop", () => {
    const { rerender } = render(
      <PalDetailsCard
        pal={mockPal}
        isFavourited={false}
        onToggleFavourite={() => {}}
        user={null}
      />
    );

    expect(screen.getByLabelText("Toggle Favourite")).toHaveAttribute(
      "data-favourite",
      "empty"
    );

    rerender(
      <PalDetailsCard
        pal={mockPal}
        isFavourited={true}
        onToggleFavourite={() => {}}
        user={null}
      />
    );

    expect(screen.getByLabelText("Toggle Favourite")).toHaveAttribute(
      "data-favourite",
      "filled"
    );
  });

  // Test accessibility features
  it("has proper accessibility attributes", () => {
    render(
      <PalDetailsCard
        pal={mockPal}
        isFavourited={false}
        onToggleFavourite={() => {}}
        user={null}
      />
    );

    expect(
      screen.getByRole("list", { name: "List of base skills" })
    ).toBeInTheDocument();
    const favouriteIcon = screen.getByLabelText("Toggle Favourite");
    expect(favouriteIcon).toHaveAttribute("role", "button");
    expect(favouriteIcon).toHaveAttribute("tabIndex", "0");
  });
});