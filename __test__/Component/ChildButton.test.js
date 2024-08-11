import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChildButton from "@/app/(pals)/saved-combinations/components/ChildButton";
import "@testing-library/jest-dom";

// Mock the Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

// Mock the CSS module
jest.mock('./styles/ChildButton.module.css', () => ({
  childContainer: 'mockChildContainer',
  childButton: 'mockChildButton',
  selected: 'mockSelected',
  childImage: 'mockChildImage',
  childName: 'mockChildName',
}));

describe('ChildButton Component', () => {
  // Define default props for the component
  const defaultProps = {
    child: 'TestChild',
    combos: [{ child: { image: '/test-image.png', name: 'Test Child' } }],
    onClick: jest.fn(),
    isSelected: false,
  };

  // Test case: Component renders correctly
  it('renders the component with correct props', () => {
    render(<ChildButton {...defaultProps} />);

    // Check if the image is rendered with correct attributes
    const image = screen.getByAltText('Test Child');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.png');

    // Check if the child name is displayed
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  // Test case: Click functionality
  it('calls onClick prop when clicked', () => {
    render(<ChildButton {...defaultProps} />);

    // Simulate a click on the button
    fireEvent.click(screen.getByRole('button'));

    // Check if the onClick prop was called with correct arguments
    expect(defaultProps.onClick).toHaveBeenCalledWith('TestChild', defaultProps.combos);
  });

  // Test case: Selected state
  it('applies selected class when isSelected prop is true', () => {
    const { rerender } = render(<ChildButton {...defaultProps} isSelected={false} />);

    // Check initial state
    expect(screen.getByRole('button')).not.toHaveClass('mockSelected');

    // Rerender with isSelected set to true
    rerender(<ChildButton {...defaultProps} isSelected={true} />);

    // Check if the selected class is applied
    expect(screen.getByRole('button')).toHaveClass('mockSelected');
  });

  // Test case: Default image and name
  it('renders default image and name when combos is empty', () => {
    render(<ChildButton {...defaultProps} combos={[]} />);

    // Check if default image is used
    const image = screen.getByAltText('Unknown');
    expect(image).toHaveAttribute('src', '/images/default.png');

    // Check if default name is displayed
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});