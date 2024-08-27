"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";

/**
 * @typedef {Object} BreedingCombo
 * @property {string} id - The unique identifier of the saved breeding combination
 * @property {string} breeding_combo_id - The identifier of the breeding combination
 * @property {string} parent1_id - The ID of the first parent pal
 * @property {string} parent1_name - The name of the first parent pal
 * @property {string} parent1_image - The image URL of the first parent pal
 * @property {string} parent2_id - The ID of the second parent pal
 * @property {string} parent2_name - The name of the second parent pal
 * @property {string} parent2_image - The image URL of the second parent pal
 * @property {string} child_id - The ID of the child pal
 * @property {string} child_name - The name of the child pal
 * @property {string} child_image - The image URL of the child pal
 */

/**
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user
 */

/**
 * @typedef {Object} SavedCombinationsContextType
 * @property {BreedingCombo[]} savedCombinations - Array of saved breeding combinations
 * @property {(breedingComboId: string) => Promise<void>} addCombination - Function to add a breeding combination
 * @property {(comboId: string) => Promise<void>} removeCombination - Function to remove a breeding combination
 * @property {User|null} user - The current user
 * @property {boolean} isLoading - Whether the saved combinations are currently loading
 * @property {() => Promise<void>} refreshSavedCombinations - Function to refresh the saved combinations
 */

/** @type {React.Context<SavedCombinationsContextType|null>} */
const SavedCombinationsContext = createContext(null);

/**
 * Provider component for managing saved breeding combinations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {User|null} props.initialUser - Initial user data
 */
export function SavedCombinationsProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [savedCombinations, setSavedCombinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  /**
   * Loads saved breeding combinations for the current user
   * @function
   * @async
   */
  const loadSavedCombinations = useCallback(async () => {
    if (user?.id) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/saved-combinations?userId=${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch saved combinations");
        }
        const combos = await response.json();
        setSavedCombinations(combos);
      } catch (error) {
        console.error("Failed to load saved combinations:", error);
        toast.error("Failed to load saved combinations");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSavedCombinations([]);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSavedCombinations();
  }, [loadSavedCombinations]);

  /**
   * Adds a breeding combination to saved combinations
   * @function
   * @async
   * @param {string} breedingComboId - The ID of the breeding combination to save
   */
  const addCombination = useCallback(
    async (breedingComboId) => {
      if (!user?.id) {
        toast.info("Please log in to save breeding combinations");
        return;
      }
      try {
        const response = await fetch("/api/saved-combinations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id, breedingComboId }),
        });
        if (!response.ok) {
          throw new Error("Failed to save breeding combination");
        }
        toast.success("Breeding combination saved");
        await loadSavedCombinations(); 
      } catch (error) {
        console.error("Failed to add combination:", error);
        toast.error("Failed to save breeding combination");
      }
    },
    [user, loadSavedCombinations]
  );

  /**
   * Removes a breeding combination from saved combinations
   * @function
   * @async
   * @param {string} comboId - The ID of the breeding combination to remove
   */
  const removeCombination = useCallback(
    async (comboId) => {
      if (!user?.id) return;
      try {
        const response = await fetch(
          `/api/saved-combinations?userId=${user.id}&comboId=${comboId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to remove breeding combination");
        }
        toast.success("Breeding combination removed");
        await loadSavedCombinations(); 
      } catch (error) {
        console.error("Failed to remove combination:", error);
        toast.error("Failed to remove breeding combination");
      }
    },
    [user, loadSavedCombinations]
  );

  return (
    <SavedCombinationsContext.Provider
      value={{
        savedCombinations,
        addCombination,
        removeCombination,
        user,
        isLoading,
        refreshSavedCombinations: loadSavedCombinations,
      }}
    >
      {children}
    </SavedCombinationsContext.Provider>
  );
}

/**
 * Hook to access the saved combinations context
 * @returns {SavedCombinationsContextType} The saved combinations context
 * @throws {Error} If used outside of SavedCombinationsProvider
 */
export const useSavedCombinations = () => {
  const context = useContext(SavedCombinationsContext);
  if (context === undefined) {
    throw new Error(
      "useSavedCombinations must be used within a SavedCombinationsProvider"
    );
  }
  return context;
};
