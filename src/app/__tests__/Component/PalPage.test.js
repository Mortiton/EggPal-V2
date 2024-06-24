import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PalPage from '@/app/(pals)/pal/[palName]/page';
import { getPalDetailsAndFavorites, fetchSavedBreedingCombos } from '@/app/(pals)/pal/[palName]/actions';
import { createClient } from '@/app/utils/supabase/server';
import PalDetailsCard from '@/app/(pals)/pal/[palName]/components/PalDetailsCards';
import BreedingList from '@/app/(pals)/pal/[palName]/components/BreedingList';

// Mock the getPalDetailsAndFavorites and fetchSavedBreedingCombos functions
jest.mock('@/app/(pals)/pal/[palName]/actions', () => ({
  getPalDetailsAndFavorites: jest.fn(),
  fetchSavedBreedingCombos: jest.fn(),
}));

// Mock the createClient function and auth.getUser method
jest.mock('@/app/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
  })),
}));

// Mock the PalDetailsCard and BreedingList components
jest.mock('@/app/(pals)/pal/[palName]/components/PalDetailsCards', () => ({ pal, user, userFavorites }) => (
    <div data-testid="pal-details-card">
    {pal.name}
  </div>
));

jest.mock('@/app/(pals)/pal/[palName]/components/BreedingList', () => ({ breedingCombos, user, savedBreedingCombos }) => (
    <div data-testid="breeding-list">
    {breedingCombos.map((combo, index) => (
      <div key={index}>{combo}</div>
    ))}
  </div>
));


describe('PalPage component', () => {
    const mockUser = { id: 'user-123' };
    const mockPalData = {
      pal_info: { name: 'Test Pal', type1: 'fire', type2: 'water' },
      breeding_combos: ['combo1', 'combo2'],
      favorites: ['favorite1', 'favorite2'],
    };
    const mockSavedBreedingCombos = ['savedCombo1', 'savedCombo2'];
  
    beforeEach(() => {
      jest.resetAllMocks();
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
      });
      getPalDetailsAndFavorites.mockResolvedValue(mockPalData);
      fetchSavedBreedingCombos.mockResolvedValue(mockSavedBreedingCombos);
    });
  
    test('renders pal details and breeding combos successfully', async () => {
      await act(async () => {
        render(<PalPage params={{ palName: 'test-pal' }} />);
      });
  
      await waitFor(() => {
        expect(screen.getByTestId('pal-details-card')).toHaveTextContent('Test Pal');
      });
      await waitFor(() => {
        const breedingList = screen.getByTestId('breeding-list');
        expect(breedingList).toHaveTextContent('combo1');
        expect(breedingList).toHaveTextContent('combo2');
      });
    });
  
    test('renders no pal information available if data is missing', async () => {
      getPalDetailsAndFavorites.mockResolvedValueOnce(null);
  
      await act(async () => {
        render(<PalPage params={{ palName: 'test-pal' }} />);
      });
  
      await waitFor(() => {
        expect(screen.getByText('No Pal information available.')).toBeInTheDocument();
      });
    });
  
    test('handles errors and renders no pal information available', async () => {
      getPalDetailsAndFavorites.mockRejectedValueOnce(new Error('Fetch error'));
  
      await act(async () => {
        render(<PalPage params={{ palName: 'test-pal' }} />);
      });
  
      await waitFor(() => {
        expect(screen.getByText('No Pal information available.')).toBeInTheDocument();
      });
    });
  });