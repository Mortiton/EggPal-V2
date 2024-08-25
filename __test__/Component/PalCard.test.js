import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PalCard from "@/app/components/PalCard";

// Mock the next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock the WorkIcon component
jest.mock("@/app/components/WorkIcon", () => {
  return function MockWorkIcon({ iconUrl, value }) {
    return <div data-testid="work-icon" data-icon-url={iconUrl} data-value={value}>WorkIcon</div>;
  };
});

// Mock the getBlurDataURL function
jest.mock("@/app/lib/imageUtils", () => ({
  getBlurDataURL: jest.fn(() => "data:image/png;base64,mockBlurDataURL"),
}));

// Mock the CSS module
jest.mock("./styles/PalCard.module.css", () => ({
  container: "mockContainer",
  card: "mockCard",
  typeIcons: "mockTypeIcons",
  typeIcon: "mockTypeIcon",
  cardImageWrapper: "mockCardImageWrapper",
  cardImage: "mockCardImage",
  cardTitle: "mockCardTitle",
  workIcons: "mockWorkIcons",
}));

describe("PalCard Component", () => {
  const mockPal = {
    id: 1,
    name: "MockPal",
    type1: "Fire",
    type2: "Water",
    type1_icon_url: "/fire-icon.png",
    type2_icon_url: "/water-icon.png",
    image_url: "/mockpal.png",
    skills: [
      { skill_name: "Kindling", skill_icon_url: "/kindling-icon.png", skill_level: 3, work_order: 2 },
      { skill_name: "Mining", skill_icon_url: "/mining-icon.png", skill_level: 2, work_order: 1 },
    ],
  };

  it("renders the pal card with correct information", () => {
    render(<PalCard pal={mockPal} />);

    // Check if the pal's name is rendered
    expect(screen.getByText("MockPal")).toBeInTheDocument();

    // Check if type icons are rendered
    const typeIcons = screen.getAllByRole("img", { name: /Type:/i });
    expect(typeIcons).toHaveLength(2);
    expect(typeIcons[0]).toHaveAttribute("src", "/fire-icon.png");
    expect(typeIcons[1]).toHaveAttribute("src", "/water-icon.png");

    // Check if the pal's image is rendered
    const palImage = screen.getByRole("img", { name: "Image of MockPal" });
    expect(palImage).toHaveAttribute("src", "/mockpal.png");

    // Check if work icons are rendered and sorted correctly
    const workIcons = screen.getAllByTestId("work-icon");
    expect(workIcons).toHaveLength(2);
    expect(workIcons[0]).toHaveAttribute("data-icon-url", "/mining-icon.png");
    expect(workIcons[1]).toHaveAttribute("data-icon-url", "/kindling-icon.png");
  });

  it("renders correctly without optional fields", () => {
    const minimalPal = {
      id: 2,
      name: "MinimalPal",
      type1: "Earth",
      type1_icon_url: "/earth-icon.png",
      image_url: "/minimalpal.png",
      skills: [],
    };

    render(<PalCard pal={minimalPal} />);

    // Check if the pal's name is rendered
    expect(screen.getByText("MinimalPal")).toBeInTheDocument();

    // Check if only one type icon is rendered
    const typeIcons = screen.getAllByRole("img", { name: /Type:/i });
    expect(typeIcons).toHaveLength(1);
    expect(typeIcons[0]).toHaveAttribute("src", "/earth-icon.png");

    // Check if the pal's image is rendered
    const palImage = screen.getByRole("img", { name: "Image of MinimalPal" });
    expect(palImage).toHaveAttribute("src", "/minimalpal.png");

    // Check that no work icons are rendered
    const workIcons = screen.queryAllByTestId("work-icon");
    expect(workIcons).toHaveLength(0);
  });

  it("has correct aria labels", () => {
    render(<PalCard pal={mockPal} />);

    // Check aria labels
    expect(screen.getByLabelText("Types of MockPal")).toBeInTheDocument();
    expect(screen.getByLabelText("MockPal")).toBeInTheDocument();
    expect(screen.getByLabelText("Work attributes of MockPal")).toBeInTheDocument();
  });

  it("has correct display name", () => {
    expect(PalCard.displayName).toBe("PalCard");
  });
});