import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/(auth)/login/components/LoginForm";
import "@testing-library/jest-dom/";
import { login } from "@/app/(auth)/login/actions";
import { useRouter } from "next/navigation";

// Mock the login action and useRouter hook
jest.mock("@/app/(auth)/login/actions", () => ({
  login: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm Component", () => {
  const mockPush = jest.fn();
  useRouter.mockReturnValue({ push: mockPush });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to render the component
  it("renders the LoginForm component correctly", () => {
    render(<LoginForm />);

    // Check if the email and password fields and the submit button are displayed
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Log in")).toBeInTheDocument();
  });

  // Test case for form validation
  it("validates the email and password fields correctly", async () => {
    render(<LoginForm />);

    // Click the submit button without entering any values
    fireEvent.click(screen.getByLabelText("Log in"));

    // Check if the validation messages are displayed
    const requiredAlerts = await screen.findAllByText("Required");
    expect(requiredAlerts).toHaveLength(2);

    // Enter an invalid email and submit
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByLabelText("Log in"));

    // Check if the validation message for invalid email is displayed
    const invalidEmailAlert = await screen.findByText("Invalid email");
    expect(invalidEmailAlert).toBeInTheDocument();

    const passwordRequiredAlert = await screen.findByText("Required");
    expect(passwordRequiredAlert).toBeInTheDocument();

    // Enter valid email but no password and submit
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByLabelText("Log in"));

    // Check if the validation message for required password is displayed
    const alertsAfterEmail = await screen.findAllByText("Required");
    expect(alertsAfterEmail).toHaveLength(1);
  });

  // Test case for successful form submission
  it("submits the form successfully", async () => {
    login.mockResolvedValueOnce();
    render(<LoginForm />);

    // Enter valid email and password and submit
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByLabelText("Log in"));

    // Check if the login action is called with the correct values
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });

    // Check if the router push is called to navigate to home page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  // Test case for failed form submission
  it("handles form submission failure", async () => {
    const errorMessage = "Invalid credentials";
    login.mockRejectedValueOnce(new Error(errorMessage));
    render(<LoginForm />);

    // Enter valid email and password and submit
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByLabelText("Log in"));

    // Check if the login action is called with the correct values
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });

    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
    });
  });

  // Test case for "Forgot Password" button
  it("navigates to forgot password page on button click", () => {
    render(<LoginForm />);

    // Click the "Forgot Password" button
    fireEvent.click(screen.getByLabelText("Forgot Password"));

    // Check if the router push is called to navigate to forgot password page
    expect(mockPush).toHaveBeenCalledWith("/forgot-password");
  });
});
