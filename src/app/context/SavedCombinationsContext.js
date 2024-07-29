"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSavedBreedingCombosWithDetails, addSavedBreedingCombo, removeSavedBreedingCombo } from '../services/userService';
import { toast } from 'react-toastify';
import { createClient } from '@/app/utils/supabase/client';

const SavedCombinationsContext = createContext();

export function SavedCombinationsProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [savedCombinations, setSavedCombinations] = useState([]);
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
      try {
        const combos = await getSavedBreedingCombosWithDetails(session.user.id);
        setSavedCombinations(combos);
      } catch (error) {
        console.error('Failed to load saved combinations:', error);
        toast.error('Failed to load saved combinations');
      }
    } else {
      setSavedCombinations([]);
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
    try {
      await addSavedBreedingCombo(session.user.id, breedingComboId);
      await loadSavedCombinations(); // Reload the saved combinations
      toast.success('Breeding combination saved');
    } catch (error) {
      console.error('Failed to add combination:', error);
      toast.error('Failed to save breeding combination');
    }
  }, [session, loadSavedCombinations]);

  const removeCombination = useCallback(async (comboId) => {
    if (!session?.user) return;
    try {
      await removeSavedBreedingCombo(session.user.id, comboId);
      setSavedCombinations(prev => prev.filter(combo => combo.breedingComboId !== comboId));
      toast.success('Breeding combination removed');
    } catch (error) {
      console.error('Failed to remove combination:', error);
      toast.error('Failed to remove breeding combination');
    }
  }, [session]);

  return (
    <SavedCombinationsContext.Provider value={{ savedCombinations, addCombination, removeCombination, session }}>
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