"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/app/utils/supabase/client';

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const loadFavourites = async () => {
      if (session?.user) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/favourites?userId=${session.user.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch favourites');
          }
          const favs = await response.json();
          setFavourites(favs);
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

    loadFavourites();
  }, [session]);

  const addFavourite = useCallback(async (pal) => {
    if (!session?.user) {
      toast.info('Please log in to add favourite pals');
      return;
    }
    // Optimistic update
    setFavourites(prev => [...prev, pal]);
    try {
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id, palId: pal.id }),
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
  }, [session]);

  const removeFavourite = useCallback(async (palId) => {
    if (!session?.user) return;
    // Optimistic update
    const removedPal = favourites.find(fav => fav.id === palId);
    setFavourites(prev => prev.filter(fav => fav.id !== palId));
    try {
      const response = await fetch(`/api/favourites?userId=${session.user.id}&palId=${palId}`, {
        method: 'DELETE',
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
  }, [session, favourites]);

  const isFavourite = useCallback((palId) => {
    return favourites.some(fav => fav.id === palId);
  }, [favourites]);

  const value = {
    favourites,
    addFavourite,
    removeFavourite,
    isFavourite,
    session,
    isLoading,
  };

  return (
    <FavouritesContext.Provider value={value}>
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