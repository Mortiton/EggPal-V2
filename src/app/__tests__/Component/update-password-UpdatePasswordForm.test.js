import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdatePasswordForm from "@/app/(auth)/update-password/components/UpdatePasswordForm";
import "@testing-library/jest-dom";
import { resetPassword } from "@/app/(auth)/update-password/actions";
import { useRouter } from "next/navigation";

// Mock the resetPassword action and useRouter hook
jest.mock("@/app/(auth)/update-password/actions", () => ({
  resetPassword: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/app/components/SuccessModal", () =>
  jest.fn(({ isOpen, onConfirm, message }) =>
    isOpen ? <div role="dialog">{message}</div> : null
  )
);

describe("UpdatePasswordForm Component", () => {
  const mockPush = jest.fn();
  useRouter.mockReturnValue({ push: mockPush });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the UpdatePasswordForm component correctly", () => {
    render(<UpdatePasswordForm accessToken="dummyToken" />);

    // Check if the password and confirmPassword fields, and the submit button are displayed
    expect(screen.getByLabelText("New Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password:")).toBeInTheDocument();
    expect(screen.getByText("Update Password")).toBeInTheDocument();
  });

  // Test case for form validation
  it("validates the form fields correctly", async () => {
    render(<UpdatePasswordForm accessToken="dummyToken" />);

    // Click the submit button without entering any values
    fireEvent.click(screen.getByText("Update Password"));

    // Check if the validation messages are displayed
    expect(await screen.findAllByText("Required")).toHaveLength(2);

    // Enter a short password and submit
    fireEvent.change(screen.getByLabelText("New Password:"), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password:"), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByText("Update Password"));

    // Check if the validation message for short password is displayed
    expect(
      await screen.findByText(
        "Password is too short - should be 8 chars minimum."
      )
    ).toBeInTheDocument();

    // Enter a valid password but different confirm password and submit
    fireEvent.change(screen.getByLabelText("New Password:"), {
      target: { value: "Valid1@Password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password:"), {
      target: { value: "DifferentPassword1@" },
    });
    fireEvent.click(screen.getByText("Update Password"));

    // Check if the validation message for password mismatch is displayed
    expect(await screen.findByText("Passwords must match")).toBeInTheDocument();
  });

  // Test case for successful form submission
  it("submits the form successfully", async () => {
    resetPassword.mockResolvedValueOnce();
    render(<UpdatePasswordForm accessToken="dummyToken" />);

    // Enter valid password and confirm password and submit
    fireEvent.change(screen.getByLabelText("New Password:"), {
      target: { value: "Valid1@Password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password:"), {
      target: { value: "Valid1@Password" },
    });
    fireEvent.click(screen.getByText("Update Password"));

    // Check if the resetPassword action is called with the correct values
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        password: "Valid1@Password",
        accessToken: "dummyToken",
      });
    });

    // Check if the success modal is displayed
    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Your password has been updated successfully."
    );
  });

  // Test case for failed form submission
  it("handles form submission failure", async () => {
    const errorMessage = "Failed to update password";
    resetPassword.mockRejectedValueOnce(new Error(errorMessage));
    render(<UpdatePasswordForm accessToken="dummyToken" />);

    // Enter valid password and confirm password and submit
    fireEvent.change(screen.getByLabelText("New Password:"), {
      target: { value: "Valid1@Password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password:"), {
      target: { value: "Valid1@Password" },
    });
    fireEvent.click(screen.getByText("Update Password"));

    // Check if the resetPassword action is called with the correct values
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        password: "Valid1@Password",
        accessToken: "dummyToken",
      });
    });

    // Check if the error message is displayed
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  // Test case for missing access token
  it("displays error message when access token is missing", async () => {
    render(<UpdatePasswordForm accessToken="" />);

    // Check if the error message for missing token is displayed
    expect(await screen.findByText("Reset token missing!")).toBeInTheDocument();
  });
});
