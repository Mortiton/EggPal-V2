"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavouritePals, addFavouritePal, removeFavouritePal } from '../services/userService';
import { toast } from 'react-toastify';
import { createClient } from '@/app/utils/supabase/client';

const FavouritesContext = createContext();

export function FavouritesProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [favourites, setFavourites] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const loadFavourites = useCallback(async () => {
    if (session?.user) {
      try {
        const favs = await getFavouritePals(session.user.id);
        setFavourites(favs);
      } catch (error) {
        console.error('Failed to load favourite pals:', error);
        toast.error('Failed to load favourite pals');
      }
    } else {
      setFavourites([]); // Clear favourites when user logs out
    }
  }, [session]);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  const addFavourite = useCallback(async (pal) => {
    if (!session?.user) {
      toast.info('Please log in to add favourite pals');
      return;
    }
    try {
      await addFavouritePal(session.user.id, pal.id);
      setFavourites(prev => [...prev, pal]);
      toast.success(`${pal.name} added to favourites`);
    } catch (error) {
      console.error('Failed to add favourite:', error);
      toast.error(`Failed to add ${pal.name} to favourites`);
    }
  }, [session]);

  const removeFavourite = useCallback(async (palId) => {
    if (!session?.user) return;
    try {
      await removeFavouritePal(session.user.id, palId);
      setFavourites(prev => prev.filter(fav => fav.id !== palId));
      toast.success('Pal removed from favourites');
    } catch (error) {
      console.error('Failed to remove favourite:', error);
      toast.error('Failed to remove pal from favourites');
    }
  }, [session]);

  const isFavourite = useCallback((palId) => {
    return favourites.some(fav => fav.id === palId);
  }, [favourites]);

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite, session }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
};