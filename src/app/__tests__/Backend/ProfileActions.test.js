import { updateEmail, updatePassword } from '@/app/profile/actions';
import { createClient } from '@/app/utils/supabase/server';

jest.mock('@/app/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

/**
 * Test suite for Profile Actions.
 */
describe('Profile Actions', () => {
  let supabase;

  beforeEach(() => {
    // Clear all previous mock data before each test
    jest.clearAllMocks();

    // Mock the Supabase client methods
    supabase = {
      auth: {
        updateUser: jest.fn(),
        getUser: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
      },
    };

    // Set the mock implementation to return the mocked Supabase client
    createClient.mockImplementation(() => supabase);
  });

  /**
   * Test case for successfully updating the email.
   * Mocks the updateUser method to return a successful response.
   */
  test('should update the email successfully', async () => {
    const email = 'newemail@example.com';
    supabase.auth.updateUser.mockResolvedValue({ error: null });

    await updateEmail(email);

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ email });
  });

  /**
   * Test case for handling errors when updating the email.
   * Mocks the updateUser method to return an error response.
   */
  test('should throw an error if email update fails', async () => {
    const email = 'newemail@example.com';
    const errorMessage = 'Update failed';
    supabase.auth.updateUser.mockResolvedValue({ error: { message: errorMessage } });

    await expect(updateEmail(email)).rejects.toThrow(errorMessage);
  });

  /**
   * Test case for successfully updating the password.
   * Mocks the getUser, signInWithPassword, and updateUser methods to return successful responses.
   */
  test('should update the password successfully', async () => {
    const currentPassword = 'currentPassword';
    const newPassword = 'newPassword';
    const user = { email: 'user@example.com' };
    
    supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null });
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
    supabase.auth.updateUser.mockResolvedValue({ error: null });

    await updatePassword(currentPassword, newPassword);

    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: user.email,
      password: currentPassword,
    });
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: newPassword });
  });

  /**
   * Test case for handling the scenario where the user is not authenticated.
   * Mocks the getUser method to return null for the user.
   */
  test('should throw an error if user is not authenticated', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(updatePassword('currentPassword', 'newPassword')).rejects.toThrow('User not authenticated');
  });

  /**
   * Test case for handling the scenario where the current password is incorrect.
   * Mocks the getUser and signInWithPassword methods to simulate an incorrect current password.
   */
  test('should throw an error if current password is incorrect', async () => {
    const user = { email: 'user@example.com' };
    supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null });
    supabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Current password is incorrect' } });

    await expect(updatePassword('currentPassword', 'newPassword')).rejects.toThrow('Current password is incorrect');
  });

  /**
   * Test case for handling errors when updating the password.
   * Mocks the getUser, signInWithPassword, and updateUser methods to simulate an error during password update.
   */
  test('should throw an error if password update fails', async () => {
    const user = { email: 'user@example.com' };
    const errorMessage = 'Update failed';
    supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null });
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
    supabase.auth.updateUser.mockResolvedValue({ error: { message: errorMessage } });

    await expect(updatePassword('currentPassword', 'newPassword')).rejects.toThrow(errorMessage);
  });
});