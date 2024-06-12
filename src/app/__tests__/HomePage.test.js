import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HomePage from '../page';
import { getPals } from '../actions';

//Mock: the getPals function
jest.mock('../actions', () => ({
    getPals: jest.fn(),
}));

//Clear previous mocks
describe('HomePage', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    });

    it('renders the PalList component with the fetched pal data', async () => {
        const mockPals = [
            { id: 1, name: 'Pal 1', type1: 'type1', type2: 'type2', kindling: 1, watering: 2, planting: 3, generating_electricity: 4, handiwork: 5, gathering: 6, lumbering: 7, mining: 8, medicine_production: 9, cooling: 10, transporting: 11, farming: 12 },
            { id: 2, name: 'Pal 2', type1: 'type1', type2: 'type2', kindling: 1, watering: 2, planting: 3, generating_electricity: 4, handiwork: 5, gathering: 6, lumbering: 7, mining: 8, medicine_production: 9, cooling: 10, transporting: 11, farming: 12 },
          ];

          getPals.mockResolvedValueOnce(mockPals);

      // Render the HomePage component
      render(<HomePage />);

      // Wait for the pals data to be fetched and rendered
      await waitFor(() => {
        // Check if the PalList component is rendered with the correct data
        mockPals.forEach(pal => {
          expect(screen.getByText(pal.name)).toBeInTheDocument();
        });
      });
    });
  
    it('renders null when there is an error fetching pals data', async () => {
      // Mock the getPals function to return null
      getPals.mockResolvedValueOnce(null);
  
      // Render the HomePage component
      render(<HomePage />);
  
      // Wait for the pals data to be fetched and rendered
      await waitFor(() => {
        // Check if an appropriate message or element is displayed when there is an error
        expect(screen.queryByText('Pal 1')).not.toBeInTheDocument();
      });
    });
});