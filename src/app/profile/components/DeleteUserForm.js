"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "../actions";
import styles from "@/app/components/styles/FormStyles.module.css";

/**
 * DeleteUserForm component that renders a form for deleting a user.
 * It displays an error message if there is an error deleting the user.
 * It also displays a confirmation button before deleting the user.
 *
 * @component
 * @returns {JSX.Element} A React component.
 */
export default function DeleteUserForm() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  
    // Function to handle deleting the user
    const handleUserDelete = async () => {
      setError(null);
      try {
        await deleteUser();
        setIsSuccessModalOpen(true);
      } catch (err) {
        setError(err.message);
      }
    };
  
    // Render the form
    return (
      <>
        <div className={styles.inputContainer}>
          {error && <div className={styles.error}>{error}</div>}
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
                style={{ backgroundColor: "red", color: "white" }}
              >
                Are you sure? Confirm Delete
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsConfirmVisible(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </>
    );
}