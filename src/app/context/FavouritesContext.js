"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { getFavouritePals, addFavouritePal, removeFavouritePal } from '../services/userService';
import { useUser } from './UserContext';

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
  const user = useUser();
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const loadFavourites = async () => {
      if (user) {
        const favs = await getFavouritePals(user.id);
        setFavourites(favs);
      }
    };

    loadFavourites();
  }, [user]);

  const addFavourite = async (pal) => {
    setFavourites([...favourites, pal]);
    await addFavouritePal(user.id, pal.id);
  };

  const removeFavourite = async (palId) => {
    setFavourites(favourites.filter(fav => fav.id !== palId));
    await removeFavouritePal(user.id, palId);
  };

  const isFavourite = (palId) => {
    return favourites.some(fav => fav.id === palId);
  };

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
 * @returns {Object} The current favourites.
 */
export const useFavourites = () => useContext(FavouritesContext);