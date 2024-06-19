import { getPals } from '@/app/actions';
import { createClient } from '@/app/utils/supabase/server';

// Mock the Supabase client creation function
jest.mock('@/app/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

describe('getPals', () => {
  let supabase;

  beforeEach(() => {
    // Clear all previous mock data before each test
    jest.clearAllMocks();
    
    // Mock the Supabase client methods
    supabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };

    // Set the mock implementation to return the mocked Supabase client
    createClient.mockReturnValue(supabase);
  });

  test('should fetch pals successfully', async () => {
    // Arrange: Define the mock data that should be returned
    const mockData = [
      {
        id: 1,
        name: 'Pal1',
        type1: 'Fire',
        type2: 'Water',
        kindling: 10,
        watering: 20,
        planting: 30,
        generating_electricity: 40,
        handiwork: 50,
        gathering: 60,
        lumbering: 70,
        mining: 80,
        medicine_production: 90,
        cooling: 100,
        transporting: 110,
        farming: 120,
      },
    ];

    // Set up the mock methods to return the mock data
    supabase.from.mockReturnThis();
    supabase.select.mockReturnThis();
    supabase.order.mockResolvedValue({ data: mockData, error: null });

    // Act: Call the function to be tested
    const result = await getPals();

    // Assert: Check that the result is as expected
    expect(result).toEqual(mockData);
    expect(supabase.from).toHaveBeenCalledWith('palInfo');
    expect(supabase.select).toHaveBeenCalledWith(
      'id,name,type1,type2,kindling,watering,planting,generating_electricity,handiwork,gathering,lumbering,mining,medicine_production,cooling,transporting,farming'
    );
    expect(supabase.order).toHaveBeenCalledWith('id', { ascending: true });
  });

  test('should return null and log error on database query failure', async () => {
    // Arrange: Define the mock error to be returned
    const mockError = new Error('Database error');
    supabase.from.mockReturnThis();
    supabase.select.mockReturnThis();
    supabase.order.mockResolvedValue({ data: null, error: mockError });

    // Mock console.error to check if it gets called
    console.error = jest.fn();

    // Act: Call the function to be tested
    const result = await getPals();

    // Assert: Check that the function returns null and logs the error
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error fetching pals:', mockError.message);
  });
});