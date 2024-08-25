"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const FavouritesContext = createContext(null);

/**
 * FavouritesProvider component that wraps children components and provides
 * the favourites context to manage user's favourite pals.
 * 
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The children components to be wrapped.
 * @param {Object} props.initialUser - The initial user object containing user information.
 * @returns {JSX.Element} The context provider for favourites.
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
              'x-user-id': user.id, // Pass user ID in headers
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch favourites');
          }
          const favs = await response.json();
          setFavourites(favs); // Ensure favourites are set correctly
          // console.log('Fetched favourites:', favs); // Debugging output
        } catch (error) {
          console.error('Failed to load favourite pals:', error);
          toast.error('Failed to load favourite pals');
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
   * Adds a pal to the user's favourites list.
   * 
   * @param {Object} pal - The pal object to be added to favourites.
   */
  const addFavourite = useCallback(async (pal) => {
    if (!user?.id) {
      toast.info('Please log in to add favourite pals.');
      return;
    }
    // Optimistic update
    setFavourites(prev => [...prev, pal]);
    try {
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id, // Pass user ID in headers
        },
        body: JSON.stringify({ palId: pal.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to add favourite');
      }
      toast.success(`${pal.name} added to favourites`);
    } catch (error) {
      // Revert optimistic update on error
      setFavourites(prev => prev.filter(fav => fav.id !== pal.id));
      console.error('Failed to add favourite:', error);
      toast.error(`Failed to add ${pal.name} to favourites`);
    }
  }, [user]);

  /**
   * Removes a pal from the user's favourites list.
   * 
   * @param {string} palId - The ID of the pal to be removed from favourites.
   */
  const removeFavourite = useCallback(async (palId) => {
    if (!user?.id) return;
    // Optimistic update
    const removedPal = favourites.find(fav => fav.id === palId);
    setFavourites(prev => prev.filter(fav => fav.id !== palId));
    try {
      const response = await fetch(`/api/favourites?palId=${palId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id, // Pass user ID in headers
        },
      });
      if (!response.ok) {
        throw new Error('Failed to remove favourite');
      }
      toast.success('Pal removed from favourites');
    } catch (error) {
      // Revert optimistic update on error
      setFavourites(prev => [...prev, removedPal]);
      console.error('Failed to remove favourite:', error);
      toast.error('Failed to remove pal from favourites');
    }
  }, [user, favourites]);

  /**
   * Checks if a specific pal is in the user's favourites list.
   * 
   * @param {string} palId - The ID of the pal to check.
   * @returns {boolean} True if the pal is in the favourites, otherwise false.
   */
  const isFavourite = useCallback((palId) => {
    return favourites.some(fav => fav.id === palId);
  }, [favourites]);

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
 * Custom hook to use the FavouritesContext.
 * 
 * @returns {Object} The favourites context value.
 * @throws Will throw an error if used outside of FavouritesProvider.
 */
export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};
