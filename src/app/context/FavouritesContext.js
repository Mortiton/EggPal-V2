"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";

/**
 * @typedef {Object} Pal
 * @property {string} id - The unique identifier of the pal
 * @property {string} name - The name of the pal
 * @property {string} type1 - The primary type of the pal
 * @property {string|null} type2 - The secondary type of the pal, if any
 * @property {string} description - A description of the pal
 * @property {string} image_url - The URL of the pal's image
 * @property {string} type1_icon_url - The URL of the icon for the pal's primary type
 * @property {string|null} type2_icon_url - The URL of the icon for the pal's secondary type, if any
 * @property {Skill[]} skills - An array of skills the pal possesses
 */

/**
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user
 */

/**
 * @typedef {Object} FavouritesContextType
 * @property {Pal[]} favourites - Array of favourite pals
 * @property {(pal: Pal) => Promise<void>} addFavourite - Function to add a pal to favourites
 * @property {(palId: string) => Promise<void>} removeFavourite - Function to remove a pal from favourites
 * @property {(palId: string) => boolean} isFavourite - Function to check if a pal is a favourite
 * @property {User|null} user - The current user
 * @property {boolean} isLoading - Whether the favourites are currently loading
 */

/** @type {React.Context<FavouritesContextType|null>} */
const FavouritesContext = createContext(null);

/**
 * Provider component for managing favourite pals
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {User|null} props.initialUser - Initial user data
 */
export function FavouritesProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to update the user state when the initialUser prop changes.
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Effect to load the user's favourite pals whenever the user changes.
  useEffect(() => {
    const loadFavourites = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/favourites`, {
            headers: {
              "x-user-id": user.id, // Pass user ID in headers
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch favourites");
          }
          const favs = await response.json();
          setFavourites(favs); // Ensure favourites are set correctly
          // console.log('Fetched favourites:', favs); // Debugging output
        } catch (error) {
          console.error("Failed to load favourite pals:", error);
          toast.error("Failed to load favourite pals");
        } finally {
          setIsLoading(false);
        }
      } else {
        setFavourites([]);
        setIsLoading(false);
      }
    };

    loadFavourites(); // Fetch favourites whenever user changes
  }, [user]);

  /**
   * Adds a pal to favourites
   * @param {Pal} pal - The pal to add to favourites
   */
  const addFavourite = useCallback(
    async (pal) => {
      if (!user?.id) {
        toast.info("Please log in to add favourite pals.");
        return;
      }
      // Optimistic update
      setFavourites((prev) => [...prev, pal]);
      try {
        const response = await fetch("/api/favourites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id, // Pass user ID in headers
          },
          body: JSON.stringify({ palId: pal.id }),
        });
        if (!response.ok) {
          throw new Error("Failed to add favourite");
        }
        toast.success(`${pal.name} added to favourites`);
      } catch (error) {
        // Revert optimistic update on error
        setFavourites((prev) => prev.filter((fav) => fav.id !== pal.id));
        console.error("Failed to add favourite:", error);
        toast.error(`Failed to add ${pal.name} to favourites`);
      }
    },
    [user]
  );

  /**
   * Removes a pal from favourites
   * @param {string} palId - The ID of the pal to remove from favourites
   */
  const removeFavourite = useCallback(
    async (palId) => {
      if (!user?.id) return;
      // Optimistic update
      const removedPal = favourites.find((fav) => fav.id === palId);
      setFavourites((prev) => prev.filter((fav) => fav.id !== palId));
      try {
        const response = await fetch(`/api/favourites?palId=${palId}`, {
          method: "DELETE",
          headers: {
            "x-user-id": user.id, // Pass user ID in headers
          },
        });
        if (!response.ok) {
          throw new Error("Failed to remove favourite");
        }
        toast.success("Pal removed from favourites");
      } catch (error) {
        // Revert optimistic update on error
        setFavourites((prev) => [...prev, removedPal]);
        console.error("Failed to remove favourite:", error);
        toast.error("Failed to remove pal from favourites");
      }
    },
    [user, favourites]
  );

  /**
   * Checks if a pal is in favourites
   * @param {string} palId - The ID of the pal to check
   * @returns {boolean} Whether the pal is in favourites
   */
  const isFavourite = useCallback(
    (palId) => {
      return favourites.some((fav) => fav.id === palId);
    },
    [favourites]
  );

  // The context value provided to children components
  const value = {
    favourites,
    addFavourite,
    removeFavourite,
    isFavourite,
    user,
    isLoading,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

/**
 * Hook to access the favourites context
 * @returns {FavouritesContextType} The favourites context
 * @throws {Error} If used outside of FavouritesProvider
 */
export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
};
