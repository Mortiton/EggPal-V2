import { resetPassword } from "@/app/(auth)/update-password/actions";
import { createClient } from "@/app/utils/supabase/server";

// Mock the Supabase client creation function
jest.mock("@/app/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

/**
 * Test suite for the resetPassword function.
 */
describe("resetPassword", () => {
  let supabase;

  beforeEach(() => {
    // Clear all previous mock data before each test
    jest.clearAllMocks();

    // Mock the Supabase client methods
    supabase = {
      auth: {
        exchangeCodeForSession: jest.fn(),
        updateUser: jest.fn(),
      },
    };

    // Set the mock implementation to return the mocked Supabase client
    createClient.mockReturnValue(supabase);
  });

  /**
   * Test case for successfully resetting the password.
   * Mocks the necessary methods to simulate a successful password reset.
   */
  it("should reset the password successfully", async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValueOnce({
      data: { session: true },
      error: null,
    });

    supabase.auth.updateUser.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const result = await resetPassword({
      password: "newpassword",
      accessToken: "validtoken",
    });
    expect(result).toEqual({ message: "Password updated successfully" });
  });

  /**
   * Test case for handling errors when authentication fails.
   * Mocks the necessary methods to simulate an authentication error.
   */
  it("should throw an error if authentication fails", async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValueOnce({
      data: { session: null },
      error: new Error("Invalid token"),
    });

    await expect(
      resetPassword({ password: "newpassword", accessToken: "invalidtoken" })
    ).rejects.toThrow("Failed to authenticate with reset token");
  });

  /**
   * Test case for handling errors when password update fails.
   * Mocks the necessary methods to simulate a password update error.
   */
  it("should throw an error if password update fails", async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValueOnce({
      data: { session: true },
      error: null,
    });

    supabase.auth.updateUser.mockResolvedValueOnce({
      data: null,
      error: new Error("Update error"),
    });

    await expect(
      resetPassword({ password: "newpassword", accessToken: "validtoken" })
    ).rejects.toThrow("Update error");
  });
});