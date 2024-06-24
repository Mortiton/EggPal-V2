import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "@/app/(auth)/signup/components/SignupForm";
import "@testing-library/jest-dom";
import { signup, checkUserExists } from "@/app/(auth)/signup/actions";
import { useRouter } from "next/navigation";

// Mock the signup and checkUserExists actions, and useRouter hook
jest.mock("@/app/(auth)/signup/actions", () => ({
  signup: jest.fn(),
  checkUserExists: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/app/components/SuccessModal", () =>
  jest.fn(({ isOpen, onConfirm, message }) =>
    isOpen ? <div role="dialog">{message}</div> : null
  )
);
jest.mock("@/app/(auth)/signup/components/TermsOfServiceModal", () =>
  jest.fn(({ isOpen, onAccept, onRequestClose }) =>
    isOpen ? (
      <div role="dialog">
        <button onClick={onAccept}>Accept</button>
        <button onClick={onRequestClose}>Close</button>
      </div>
    ) : null
  )
);

describe("SignupForm Component", () => {
  const mockPush = jest.fn();
  useRouter.mockReturnValue({ push: mockPush });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the SignupForm component correctly", () => {
    render(<SignupForm />);

    // Check if the email, password, and confirmPassword fields, and the submit button are displayed
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password:")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  // Test case for form validation
  it("validates the form fields correctly", async () => {
    render(<SignupForm />);

    // Click the submit button without entering any values
    fireEvent.click(screen.getByText("Sign Up"));

    // Check if the validation messages are displayed
    expect(await screen.findAllByText("Required")).toHaveLength(3);

    // Enter an invalid email and submit
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    // Check if the validation message for invalid email is displayed
    expect(await screen.findByText("Invalid email")).toBeInTheDocument();

    // Enter valid email but no password and submit
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    // Check if the validation message for required password is displayed
    expect(await screen.findAllByText("Required")).toHaveLength(2);
  });

  // Test case for successful form submission
  it("submits the form successfully", async () => {
    checkUserExists.mockResolvedValueOnce(false);
    signup.mockResolvedValueOnce();
    render(<SignupForm />);

    // Enter valid email and password and submit
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "Password1@" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password:"), {
      target: { value: "Password1@" },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    // Check if the checkUserExists action is called with the correct email
    await waitFor(() => {
      expect(checkUserExists).toHaveBeenCalledWith("test@example.com");
    });

    // Accept terms of service
    fireEvent.click(screen.getByText("Accept"));

    // Check if the signup action is called with the correct values
    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
    });

    // Check if the success modal is displayed
    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Please check your emails to complete the signup process."
    );
  });

  // Test case for failed form submission
  it("handles form submission failure", async () => {
    checkUserExists.mockResolvedValueOnce(false);
    const errorMessage = "Signup failed";
    signup.mockRejectedValueOnce(new Error(errorMessage));
    render(<SignupForm />);

    // Enter valid email and password and submit
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "Password1@" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password:"), {
      target: { value: "Password1@" },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    // Check if the checkUserExists action is called with the correct email
    await waitFor(() => {
      expect(checkUserExists).toHaveBeenCalledWith("test@example.com");
    });

    // Accept terms of service
    fireEvent.click(screen.getByText("Accept"));

    // Check if the signup action is called and fails
    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
    });

    // Check if the error message is displayed
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  // Test case for existing user
  it("handles existing user error", async () => {
    checkUserExists.mockResolvedValueOnce(true);
    render(<SignupForm />);

    // Enter valid email and password and submit
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "Password1@" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password:"), {
      target: { value: "Password1@" },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    // Check if the checkUserExists action is called with the correct email
    await waitFor(() => {
      expect(checkUserExists).toHaveBeenCalledWith("test@example.com");
    });

    // Check if the error message for existing user is displayed
    expect(
      await screen.findByText("User already registered")
    ).toBeInTheDocument();
  });
});
