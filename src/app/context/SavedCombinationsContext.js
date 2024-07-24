"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSavedBreedingCombosWithDetails, addSavedBreedingCombo, removeSavedBreedingCombo } from '../services/userService';
import { useUser } from './UserContext';
import { toast } from 'react-toastify';

const SavedCombinationsContext = createContext();

export function SavedCombinationsProvider({ children }) {
  const { user } = useUser();
  const [savedCombinations, setSavedCombinations] = useState([]);

  const loadSavedCombinations = useCallback(async () => {
    if (user) {
      try {
        const combos = await getSavedBreedingCombosWithDetails(user.id);
        setSavedCombinations(combos);
      } catch (error) {
        console.error('Failed to load saved combinations:', error);
        toast.error('Failed to load saved combinations');
      }
    } else {
      setSavedCombinations([]);
    }
  }, [user]);

  useEffect(() => {
    loadSavedCombinations();
  }, [loadSavedCombinations]);

  const addCombination = useCallback(async (breedingComboId) => {
    if (!user) {
      toast.info('Please log in to save breeding combinations');
      return;
    }
    try {
      await addSavedBreedingCombo(user.id, breedingComboId);
      await loadSavedCombinations(); // Reload the saved combinations
      toast.success('Breeding combination saved');
    } catch (error) {
      console.error('Failed to add combination:', error);
      toast.error('Failed to save breeding combination');
    }
  }, [user, loadSavedCombinations]);

  const removeCombination = useCallback(async (comboId) => {
    if (!user) return;
    try {
      await removeSavedBreedingCombo(user.id, comboId);
      setSavedCombinations(prev => prev.filter(combo => combo.breedingComboId !== comboId));
      toast.success('Breeding combination removed');
    } catch (error) {
      console.error('Failed to remove combination:', error);
      toast.error('Failed to remove breeding combination');
    }
  }, [user]);

  return (
    <SavedCombinationsContext.Provider value={{ savedCombinations, addCombination, removeCombination }}>
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