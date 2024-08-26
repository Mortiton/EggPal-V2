"use client";

import React, { useState, useCallback } from "react";
import { deleteUser } from "@/app/services/profileService";
import styles from "@/app/components/styles/FormStyles.module.css";
import { toast } from "react-toastify";

/**
 * @component DeleteUserForm
 * @description Renders a form for user account deletion with confirmation step
 * @returns {JSX.Element} The rendered delete user form
 */
export default function DeleteUserForm() {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the user deletion process
   * @function
   * @async
   */
  const handleUserDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await deleteUser();

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        const logoutResponse = await fetch("/auth/signout", { method: "POST" });

        let redirectUrl =
          "/success?title=" + encodeURIComponent("Account Deleted");
        if (logoutResponse.ok) {
          redirectUrl +=
            "&description=" +
            encodeURIComponent(
              result.message || "Your account has been successfully deleted."
            );
        } else {
          redirectUrl +=
            "&description=" +
            encodeURIComponent(
              "Account deleted but logout failed. Please manually log out."
            );
        }
        window.location.assign(redirectUrl);
      } else {
        throw new Error("An unexpected error occurred");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      setIsConfirmVisible(false);
    }
  }, []);

  return (
    <div className={styles.inputContainer}>
      {!isConfirmVisible ? (
        <button
          className={styles.button}
          onClick={() => setIsConfirmVisible(true)}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete Account
        </button>
      ) : (
        <>
          <button
            className={styles.button}
            onClick={handleUserDelete}
            disabled={isLoading}
            style={{ backgroundColor: "red", color: "white" }}
          >
            {isLoading ? "Processing..." : "Are you sure? Confirm Delete"}
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => setIsConfirmVisible(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

DeleteUserForm.displayName = "DeleteUserForm";
