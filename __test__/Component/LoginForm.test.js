import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "@/app/(auth)/login/components/LoginForm";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the Supabase client
jest.mock("@/app/utils/supabase/client", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
    },
  })),
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the CSS module
jest.mock("@/app/components/styles/FormStyles.module.css", () => ({
  inputContainer: "mockInputContainer",
  label: "mockLabel",
  input: "mockInput",
  validation: "mockValidation",
  button: "mockButton",
  error: "mockError",
}));

describe("LoginForm Component", () => {
  let mockPush;
  let mockRefresh;
  let mockSignInWithPassword;

  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean slate
    jest.clearAllMocks();

    // Set up mocks for router functions and Supabase auth
    mockPush = jest.fn();
    mockRefresh = jest.fn();
    mockSignInWithPassword = jest.fn();

    require("next/navigation").useRouter.mockImplementation(() => ({
      push: mockPush,
      refresh: mockRefresh,
    }));

    require("@/app/utils/supabase/client").createClient.mockImplementation(
      () => ({
        auth: {
          signInWithPassword: mockSignInWithPassword,
        },
      })
    );
  });

  it("renders the login form correctly", () => {
    render(<LoginForm />);

    // Check if all necessary form elements are present
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Forgot Password" })
    ).toBeInTheDocument();
  });

  it("displays validation errors for empty fields", async () => {
    render(<LoginForm />);

    // Submit the form without entering any data
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    // Check if validation error messages appear
    await waitFor(() => {
      expect(screen.getAllByText("Required")).toHaveLength(2);
    });
  });

  it('displays validation error for invalid email', async () => {
    render(<LoginForm />);
    
    // Enter an invalid email and submit the form
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'invalid-email' } });
    fireEvent.blur(screen.getByLabelText('Email:')); // Trigger blur event to ensure validation runs
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    // Check if the email validation error message appears
    await waitFor(() => {
      const errorElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'div' && 
               content.toLowerCase().includes('invalid email');
      }, { timeout: 3000 });
      expect(errorElement).toBeInTheDocument();
    });
  });

  it("submits the form with valid credentials and handles successful login", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm />);

    // Fill in valid credentials and submit the form
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    // Check if the login process is handled correctly
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
        "Logged in successfully"
      );
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("handles login failure and displays error message", async () => {
    const errorMessage = "Invalid credentials";
    mockSignInWithPassword.mockResolvedValue({
      error: new Error(errorMessage),
    });

    render(<LoginForm />);

    // Fill in credentials and submit the form
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    // Check if the error is handled and displayed correctly
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(require("react-toastify").toast.error).toHaveBeenCalledWith(
        "Login failed"
      );
    });
  });

  it('navigates to forgot password page when "Forgot Password" is clicked', () => {
    render(<LoginForm />);

    // Click the "Forgot Password" button
    fireEvent.click(screen.getByRole("button", { name: "Forgot Password" }));

    // Check if the router navigates to the forgot password page
    expect(mockPush).toHaveBeenCalledWith("/forgot-password");
  });

  it("disables submit button while form is submitting", async () => {
    mockSignInWithPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginForm />);

    // Fill in credentials and submit the form
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    // Check if the submit button is disabled immediately after submission
    expect(screen.getByRole("button", { name: "Log in" })).toBeDisabled();

    // Check if the submit button is re-enabled after the submission is complete
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Log in" })).not.toBeDisabled();
    });
  });

  it("has correct display name", () => {
    // Ensure the component has the correct display name
    expect(LoginForm.displayName).toBe("LoginForm");
  });
});
