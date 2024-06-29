import { resetPassword } from '@/app/(auth)/forgot-password/actions';
import { createClient } from '@/app/utils/supabase/server';

// Mock the Supabase client creation function
jest.mock('@/app/utils/supabase/server', () => ({
    createClient: jest.fn(),
  }));
  
  describe('Auth Actions', () => {
    let supabase;
  
    beforeEach(() => {
      // Clear all previous mock data before each test
      jest.clearAllMocks();
  
      // Mock the Supabase client methods
      supabase = {
        auth: {
          resetPasswordForEmail: jest.fn(),
        },
      };
  
      // Set the mock implementation to return the mocked Supabase client
      createClient.mockReturnValue(supabase);
    });
  
    /**
     * Test suite for the resetPassword function
     */
    describe('resetPassword', () => {
      /**
       * Test case for successful password reset email initiation
       */
      it('should initiate password reset successfully', async () => {
        supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
          error: null,
        });
  
        await resetPassword('test@example.com');
        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
          redirectTo: 'http://localhost:3000/update-password',
        });
      });
  
      /**
       * Test case for handling errors during password reset email initiation
       */
      it('should throw an error if reset password fails', async () => {
        supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
          error: new Error('Reset error'),
        });
  
        await expect(resetPassword('test@example.com')).rejects.toThrow('Reset error');
      });
    });
  });