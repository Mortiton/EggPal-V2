"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@/app/utils/supabase/client';

const SavedCombinationsContext = createContext();

export function SavedCombinationsProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [savedCombinations, setSavedCombinations] = useState([]);
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

  const loadSavedCombinations = useCallback(async () => {
    if (session?.user) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/saved-combinations?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch saved combinations');
        }
        const combos = await response.json();
        setSavedCombinations(combos);
      } catch (error) {
        console.error('Failed to load saved combinations:', error);
        toast.error('Failed to load saved combinations');
      } finally {
        setIsLoading(false);
      }
    } else {
      setSavedCombinations([]);
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadSavedCombinations();
  }, [loadSavedCombinations]);

  const addCombination = useCallback(async (breedingComboId) => {
    if (!session?.user) {
      toast.info('Please log in to save breeding combinations');
      return;
    }
    // Optimistic update
    setSavedCombinations(prev => [...prev, { breedingComboId }]);
    try {
      const response = await fetch('/api/saved-combinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id, breedingComboId }),
      });
      if (!response.ok) {
        throw new Error('Failed to save breeding combination');
      }
      toast.success('Breeding combination saved');
    } catch (error) {
      // Revert optimistic update on error
      setSavedCombinations(prev => prev.filter(combo => combo.breedingComboId !== breedingComboId));
      console.error('Failed to add combination:', error);
      toast.error('Failed to save breeding combination');
    }
  }, [session]);

  const removeCombination = useCallback(async (comboId) => {
    if (!session?.user) return;
    // Optimistic update
    setSavedCombinations(prev => prev.filter(combo => combo.breedingComboId !== comboId));
    try {
      const response = await fetch(`/api/saved-combinations?userId=${session.user.id}&comboId=${comboId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove breeding combination');
      }
      toast.success('Breeding combination removed');
    } catch (error) {
      // Revert optimistic update on error
      setSavedCombinations(prev => [...prev, { breedingComboId: comboId }]);
      console.error('Failed to remove combination:', error);
      toast.error('Failed to remove breeding combination');
    }
  }, [session]);

  return (
    <SavedCombinationsContext.Provider value={{ savedCombinations, addCombination, removeCombination, session, isLoading }}>
      {children}
    </SavedCombinationsContext.Provider>
  );
}

export const useSavedCombinations = () => {
  const context = useContext(SavedCombinationsContext);
  if (context === undefined) {
    throw new Error('useSavedCombinations must be used within a SavedCombinationsProvider');
  }
  return context;
};