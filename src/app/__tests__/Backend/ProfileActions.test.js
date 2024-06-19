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

describe('Profile Actions', () => {
  let supabase;

  beforeEach(() => {
    jest.clearAllMocks();

    supabase = {
      auth: {
        updateUser: jest.fn(),
        getUser: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
      },
    };

    createClient.mockImplementation(() => supabase);
  });

  test('should update the email successfully', async () => {
    const email = 'newemail@example.com';
    supabase.auth.updateUser.mockResolvedValue({ error: null });

    await updateEmail(email);

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ email });
  });

  test('should throw an error if email update fails', async () => {
    const email = 'newemail@example.com';
    const errorMessage = 'Update failed';
    supabase.auth.updateUser.mockResolvedValue({ error: { message: errorMessage } });

    await expect(updateEmail(email)).rejects.toThrow(errorMessage);
  });

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

  test('should throw an error if user is not authenticated', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(updatePassword('currentPassword', 'newPassword')).rejects.toThrow('User not authenticated');
  });

  test('should throw an error if current password is incorrect', async () => {
    const user = { email: 'user@example.com' };
    supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null });
    supabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Current password is incorrect' } });

    await expect(updatePassword('currentPassword', 'newPassword')).rejects.toThrow('Current password is incorrect');
  });

  test('should throw an error if password update fails', async () => {
    const user = { email: 'user@example.com' };
    const errorMessage = 'Update failed';
    supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null });
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
    supabase.auth.updateUser.mockResolvedValue({ error: { message: errorMessage } });

    await expect(updatePassword('currentPassword', 'newPassword')).rejects.toThrow(errorMessage);
  });

});