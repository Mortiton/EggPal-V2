import {
  checkUserExists,
  signup,
  resetPassword,
} from "@/app/(auth)/signup/actions";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Mock the Supabase client creation function
jest.mock("@/app/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

/**
 * Test suite for Auth Actions.
 */
describe("Auth Actions", () => {
  let supabase;

  beforeEach(() => {
    // Clear all previous mock data before each test
    jest.clearAllMocks();

    // Mock the Supabase client methods
    supabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      rpc: jest.fn(),
      auth: {
        signUp: jest.fn(),
        api: {
          resetPasswordForEmail: jest.fn(),
        },
      },
    };

    // Set the mock implementation to return the mocked Supabase client
    createClient.mockReturnValue(supabase);
  });

  /**
   * Test suite for the checkUserExists function.
   */
  describe("checkUserExists", () => {
    /**
     * Test case for checking if a user exists and returning true.
     * Mocks the necessary methods to simulate a user existing.
     */
    it("should return true if user exists", async () => {
      supabase.rpc.mockResolvedValueOnce({
        data: [{ id: 1 }],
        error: null,
      });

      const exists = await checkUserExists("test@example.com");
      expect(exists).toBe(true);
    });

    /**
     * Test case for checking if a user does not exist and returning false.
     * Mocks the necessary methods to simulate no user existing.
     */
    it("should return false if user does not exist", async () => {
      supabase.rpc.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const exists = await checkUserExists("test@example.com");
      expect(exists).toBe(false);
    });

    /**
     * Test case for handling errors when checking if a user exists.
     * Mocks the necessary methods to simulate an RPC error.
     */
    it("should throw an error if RPC fails", async () => {
      supabase.rpc.mockResolvedValueOnce({
        data: null,
        error: new Error("RPC error"),
      });

      await expect(checkUserExists("test@example.com")).rejects.toThrow(
        "RPC error"
      );
    });
  });

  /**
   * Test suite for the signup function.
   */
  describe("signup", () => {
    /**
     * Test case for successfully signing up a new user.
     * Mocks the necessary methods to simulate a successful signup.
     */
    it("should sign up a new user successfully", async () => {
      supabase.rpc.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      supabase.auth.signUp.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password");

      await signup(formData);
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    /**
     * Test case for handling errors when a user already exists.
     * Mocks the necessary methods to simulate a user already existing.
     */
    it("should throw an error if user already exists", async () => {
      supabase.rpc.mockResolvedValueOnce({
        data: [{ id: 1 }],
        error: null,
      });

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password");

      await expect(signup(formData)).rejects.toThrow("User already registered");
    });

    /**
     * Test case for handling errors when signup fails.
     * Mocks the necessary methods to simulate a signup error.
     */
    it("should redirect to /error if signUp fails", async () => {
      supabase.rpc.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      supabase.auth.signUp.mockResolvedValueOnce({
        data: null,
        error: new Error("SignUp error"),
      });

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password");

      await signup(formData);
      expect(redirect).toHaveBeenCalledWith("/error");
    });
  });

  /**
   * Test suite for the resetPassword function.
   */
  describe("resetPassword", () => {
    /**
     * Test case for successfully initiating a password reset.
     * Mocks the necessary methods to simulate a successful password reset initiation.
     */
    it("should initiate password reset successfully", async () => {
      supabase.auth.api.resetPasswordForEmail.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await resetPassword("test@example.com");
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    /**
     * Test case for handling errors when initiating a password reset.
     * Mocks the necessary methods to simulate a password reset error.
     */
    it("should throw an error if reset password fails", async () => {
      supabase.auth.api.resetPasswordForEmail.mockResolvedValueOnce({
        data: null,
        error: new Error("Reset error"),
      });

      await expect(resetPassword("test@example.com")).rejects.toThrow(
        "Reset error"
      );
    });
  });
});