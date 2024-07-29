"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  const addFavourite = async (pal) => {
    if (!session?.user) {
      toast.info('Please log in to add favourite pals');
      return;
    }
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
      setFavourites(prev => [...prev, pal]);
      toast.success(`${pal.name} added to favourites`);
    } catch (error) {
      console.error('Failed to add favourite:', error);
      toast.error(`Failed to add ${pal.name} to favourites`);
    }
  };

  const removeFavourite = async (palId) => {
    if (!session?.user) return;
    try {
      const response = await fetch(`/api/favourites?userId=${session.user.id}&palId=${palId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove favourite');
      }
      setFavourites(prev => prev.filter(fav => fav.id !== palId));
      toast.success('Pal removed from favourites');
    } catch (error) {
      console.error('Failed to remove favourite:', error);
      toast.error('Failed to remove pal from favourites');
    }
  };

  const isFavourite = (palId) => {
    return favourites.some(fav => fav.id === palId);
  };

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