import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UpdatePasswordForm from "@/app/profile/components/UpdatePasswordForm";
import { updatePassword } from "@/app/profile/actions";

jest.mock("@/app/profile/actions", () => ({
  updatePassword: jest.fn(),
}));

describe("UpdatePasswordForm component", () => {
  beforeEach(() => {
    // Set up a div with id "modal-root" before each test
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    // Clean up the div with id "modal-root" after each test
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  /**
   * Test to verify that the UpdatePasswordForm component renders correctly.
   */
  test("renders the form fields and submit button", () => {
    render(<UpdatePasswordForm />);

    expect(
      screen.getByLabelText("Current password input field")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("New password input field")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Confirm new password input field")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update password button" })
    ).toBeInTheDocument();
  });

  /**
   * Test to verify that validation errors are displayed for empty fields.
   */
  test("displays validation errors for empty fields", async () => {
    render(<UpdatePasswordForm />);

    fireEvent.click(
      screen.getByRole("button", { name: "Update password button" })
    );

    await waitFor(() => {
      expect(screen.getAllByText("Required")).toHaveLength(3);
    });
  });

  /**
   * Test to verify that validation errors are displayed for invalid password.
   */
  test("displays validation errors for invalid password", async () => {
    render(<UpdatePasswordForm />);

    fireEvent.change(screen.getByLabelText("New password input field"), {
      target: { value: "short" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Update password button" })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Password is too short - should be 8 chars minimum.")
      ).toBeInTheDocument();
    });
  });

  /**
   * Test to verify that passwords must match validation works.
   */
  test("displays validation error when passwords do not match", async () => {
    render(<UpdatePasswordForm />);

    fireEvent.change(screen.getByLabelText("New password input field"), {
      target: { value: "ValidPassword123!" },
    });
    fireEvent.change(
      screen.getByLabelText("Confirm new password input field"),
      {
        target: { value: "DifferentPassword123!" },
      }
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Update password button" })
    );

    await waitFor(() => {
      expect(screen.getByText("Passwords must match")).toBeInTheDocument();
    });
  });

  /**
   * Test to verify that the password is successfully updated.
   */
  test("calls updatePassword with correct values and shows success modal", async () => {
    updatePassword.mockResolvedValueOnce();
    render(<UpdatePasswordForm />);

    fireEvent.change(screen.getByLabelText("Current password input field"), {
      target: { value: "CurrentPassword123!" },
    });
    fireEvent.change(screen.getByLabelText("New password input field"), {
      target: { value: "NewPassword123!" },
    });
    fireEvent.change(
      screen.getByLabelText("Confirm new password input field"),
      {
        target: { value: "NewPassword123!" },
      }
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Update password button" })
    );

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith(
        "CurrentPassword123!",
        "NewPassword123!"
      );
      expect(
        screen.getByText("Your password has been successfully updated.")
      ).toBeInTheDocument();
    });
  });

  /**
   * Test to verify that an error message is displayed when updating the password fails.
   */
  test("displays an error message when updating the password fails", async () => {
    updatePassword.mockRejectedValueOnce(new Error("Update failed"));
    render(<UpdatePasswordForm />);

    fireEvent.change(screen.getByLabelText("Current password input field"), {
      target: { value: "CurrentPassword123!" },
    });
    fireEvent.change(screen.getByLabelText("New password input field"), {
      target: { value: "NewPassword123!" },
    });
    fireEvent.change(
      screen.getByLabelText("Confirm new password input field"),
      {
        target: { value: "NewPassword123!" },
      }
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Update password button" })
    );

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith(
        "CurrentPassword123!",
        "NewPassword123!"
      );
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });
});
