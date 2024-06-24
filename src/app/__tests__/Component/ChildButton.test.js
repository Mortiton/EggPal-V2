import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChildButton from "@/app/(pals)/saved-combinations/components/ChildButton";
import "@testing-library/jest-dom";

describe("ChildButton Component", () => {
  const child = "child1";
  const combos = [
    {
      child: { image: "/images/child1.png", name: "Child One" },
      parents: ["Parent1", "Parent2"],
    },
  ];
  const onClick = jest.fn();
  const isSelected = false;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the ChildButton component correctly", () => {
    render(
      <ChildButton
        child={child}
        combos={combos}
        onClick={onClick}
        isSelected={isSelected}
      />
    );

    // Check if the child's name and image are displayed
    expect(screen.getByText("Child One")).toBeInTheDocument();
    expect(screen.getByAltText("Child One")).toBeInTheDocument();
  });

  // Test case to handle button click
  it("handles button click correctly", () => {
    render(
      <ChildButton
        child={child}
        combos={combos}
        onClick={onClick}
        isSelected={isSelected}
      />
    );

    // Click the button
    fireEvent.click(screen.getByRole("button"));

    // Expect the onClick function to be called with the correct arguments
    expect(onClick).toHaveBeenCalledWith(child, combos);
  });

  // Test case to check if the selected class is applied
  it("applies the selected class when isSelected is true", () => {
    render(
      <ChildButton
        child={child}
        combos={combos}
        onClick={onClick}
        isSelected={true}
      />
    );

    // Check if the selected class is applied
    expect(screen.getByRole("button")).toHaveClass("selected");
  });

  // Test case to check if default image and name are used when not provided
  it("uses default image and name when not provided", () => {
    const combosWithNoImage = [
      {
        child: { image: "", name: "" },
        parents: ["Parent1", "Parent2"],
      },
    ];

    render(
      <ChildButton
        child={child}
        combos={combosWithNoImage}
        onClick={onClick}
        isSelected={isSelected}
      />
    );

    // Check if the default image and name are used
    expect(screen.getByAltText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
