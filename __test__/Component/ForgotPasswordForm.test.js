import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordForm from "@/app/(auth)/forgot-password/components/ForgotPasswordForm";
import "@testing-library/jest-dom";
import { resetPassword } from "../../src/app/(auth)/forgot-password/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Mock the resetPassword action and useRouter hook
jest.mock("@/app/(auth)/forgot-password/actions", () => ({
  resetPassword: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));
jest.mock("@/app/components/SuccessModal", () =>
  jest.fn(({ isOpen, onConfirm, message }) =>
    isOpen ? <div role="dialog">{message}</div> : null
  )
);

describe("ForgotPasswordForm Component", () => {
  const mockPush = jest.fn();
  useRouter.mockReturnValue({ push: mockPush });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the ForgotPasswordForm component correctly", () => {
    render(<ForgotPasswordForm />);

    // Check if the email field and submit button are displayed
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Send reset link")).toBeInTheDocument();
  });

  // Test case for form validation
  it("validates the email field correctly", async () => {
    render(<ForgotPasswordForm />);

    // Click the submit button without entering an email
    fireEvent.click(screen.getByLabelText("Send reset link"));

    // Check if the validation message is displayed
    expect(await screen.findByRole("alert")).toHaveTextContent("Required");

    // Enter an invalid email and submit
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByLabelText("Send reset link"));

    // Check if the validation message is displayed for the invalid email
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
    });
  });

  // Test case for successful form submission
  it("submits the form successfully", async () => {
    resetPassword.mockResolvedValueOnce();
    render(<ForgotPasswordForm />);

    // Enter a valid email and submit
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByLabelText("Send reset link"));

    // Check if the resetPassword action is called with the correct email
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith("test@example.com");
    });

    // Check if the success modal is displayed
    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Password reset email sent! Check your inbox."
    );
  });

  // Test case for failed form submission
  it("handles form submission failure", async () => {
    const errorMessage = "Network Error";
    resetPassword.mockRejectedValueOnce(new Error(errorMessage));
    render(<ForgotPasswordForm />);

    // Enter a valid email and submit
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByLabelText("Send reset link"));

    // Check if the resetPassword action is called with the correct email
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith("test@example.com");
    });

    // Check if the toast error is displayed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `Failed to send reset email: ${errorMessage}`
      );
    });
  });
});
