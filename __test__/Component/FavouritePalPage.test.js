import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FavouritePalsPage from '@/app/(pals)/favourite-pals/page';
import { getFavouritePals } from '@/app/(pals)/favourite-pals/actions';
import { createClient } from '@/app/utils/supabase/server';
import { useRouter, redirect } from 'next/navigation';
import PalCard from '@/app/components/PalCard';

// Mock the getFavouritePals function
jest.mock('@/app/(pals)/favourite-pals/actions', () => ({
  getFavouritePals: jest.fn(),
}));

// Mock the createClient function and auth.getUser method
jest.mock('@/app/utils/supabase/server', () => ({
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn(),
      },
    })),
  }));
  
  // Mock the Next.js redirect function
  jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
  }));
  
  // Mock PalCard component
  jest.mock('@/app/components/PalCard', () => ({ pal }) => (
    <div data-testid={`pal-${pal.id}`}>
      {pal.name}
    </div>
  ));
  
  describe('FavouritePalsPage component', () => {
    const mockUser = { id: 'user-123' };
    const mockPals = [
      { id: 1, name: 'Pal 1', type1: 'fire', type2: 'water' },
      { id: 2, name: 'Pal 2', type1: 'earth', type2: 'air' },
    ];
  
    beforeEach(() => {
      jest.resetAllMocks();
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
      });
      getFavouritePals.mockResolvedValue(mockPals);
    });
  
    test('redirects to login if no user is authenticated', async () => {
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
        },
      });
  
      await render(await FavouritePalsPage());
  
      await waitFor(() => expect(redirect).toHaveBeenCalledWith('/login'));
    });
  
    test('renders no favourite pals message if none are found', async () => {
      getFavouritePals.mockResolvedValue([]);
  
      await render(await FavouritePalsPage());
  
      expect(await screen.findByText('No favourite pals found. Click the star icon on their pages to see them here.')).toBeInTheDocument();
    });
  
    test('renders favourite pals correctly', async () => {
      await render(await FavouritePalsPage());
  
      for (const pal of mockPals) {
        expect(await screen.findByTestId(`pal-${pal.id}`)).toHaveTextContent(pal.name);
      }
    });
  });