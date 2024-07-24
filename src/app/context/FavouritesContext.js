"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavouritePals, addFavouritePal, removeFavouritePal } from '../services/userService';
import { useUser } from './UserContext';
import { toast } from 'react-toastify';

/**
 * FavouritesContext
 * Context for managing user's favourite pals.
 */
const FavouritesContext = createContext();

/**
 * FavouritesProvider
 * Provides favourites context to the application.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactNode} The provider with favourites data.
 */
export function FavouritesProvider({ children }) {
  const { user } = useUser();
  const [favourites, setFavourites] = useState([]);

  const loadFavourites = useCallback(async () => {
    if (user) {
      try {
        const favs = await getFavouritePals(user.id);
        setFavourites(favs);
      } catch (error) {
        console.error('Failed to load favourite pals:', error);
        toast.error('Failed to load favourite pals');
      }
    } else {
      setFavourites([]); // Clear favourites when user logs out
    }
  }, [user]);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  const addFavourite = useCallback(async (pal) => {
    if (!user) {
      toast.info('Please log in to add favourite pals');
      return;
    }
    try {
      await addFavouritePal(user.id, pal.id);
      setFavourites(prev => [...prev, pal]);
      toast.success(`${pal.name} added to favourites`);
    } catch (error) {
      console.error('Failed to add favourite:', error);
      toast.error(`Failed to add ${pal.name} to favourites`);
    }
  }, [user]);

  const removeFavourite = useCallback(async (palId) => {
    if (!user) return;
    try {
      await removeFavouritePal(user.id, palId);
      setFavourites(prev => prev.filter(fav => fav.id !== palId));
      toast.success('Pal removed from favourites');
    } catch (error) {
      console.error('Failed to remove favourite:', error);
      toast.error('Failed to remove pal from favourites');
    }
  }, [user]);

  const isFavourite = useCallback((palId) => {
    return favourites.some(fav => fav.id === palId);
  }, [favourites]);

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

/**
 * useFavourites
 * Custom hook to use the FavouritesContext.
 *
 * @returns {Object} The current favourites and related functions.
 */
export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};