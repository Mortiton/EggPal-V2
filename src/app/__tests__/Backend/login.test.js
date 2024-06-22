import { login } from '@/app/(auth)/login/actions';
import { createClient } from '@/app/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Mock the Supabase client creation function.
 */
jest.mock('@/app/utils/supabase/server', () => ({
    createClient: jest.fn(),
  }));
  
  /**
   * Mock the revalidatePath function from 'next/cache'.
   */
  jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
  }));
  
  /**
   * Test suite for Authentication Actions.
   */
  describe('Auth Actions', () => {
    let supabase;
  
    beforeEach(() => {
      // Clear all previous mock data before each test
      jest.clearAllMocks();
  
      // Mock the Supabase client methods
      supabase = {
        auth: {
          signInWithPassword: jest.fn(),
        },
      };
  
      // Set the mock implementation to return the mocked Supabase client
      createClient.mockReturnValue(supabase);
    });
  
    /**
     * Test suite for the login function.
     */
    describe('login', () => {
      /**
       * Test case for successful login.
       * It mocks a successful login attempt and verifies the success response.
       */
      it('should login successfully', async () => {
        supabase.auth.signInWithPassword.mockResolvedValueOnce({
          error: null,
        });
  
        const result = await login({ email: 'test@example.com', password: 'password' });
        expect(result).toEqual({ success: true });
        expect(revalidatePath).toHaveBeenCalledWith('/');
      });
  
      /**
       * Test case for login failure.
       * It mocks a failed login attempt and verifies that an error is thrown.
       */
      it('should throw an error if login fails', async () => {
        supabase.auth.signInWithPassword.mockResolvedValueOnce({
          error: new Error('Invalid email or password'),
        });
  
        await expect(login({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Invalid email or password');
      });
    });
  });