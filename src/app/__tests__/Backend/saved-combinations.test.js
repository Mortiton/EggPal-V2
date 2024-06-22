import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  fetchSavedBreedingCombos,
  addSavedBreedingCombo,
  removeSavedBreedingCombo,
} from "../../(pals)/saved-combinations/actions";

// Mock the Supabase client creation function
jest.mock("@/app/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

/**
 * Test suite for action functions.
 */
describe("Action Tests", () => {
  let supabase;

  beforeEach(() => {
    // Clear all previous mock data before each test
    jest.clearAllMocks();

    // Mock the Supabase client methods
    supabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };

    // Set the mock implementation to return the mocked Supabase client
    createClient.mockReturnValue(supabase);
  });

  /**
   * Test suite for the fetchSavedBreedingCombos function.
   */
  describe("fetchSavedBreedingCombos", () => {
    /**
     * Test case for successfully fetching saved breeding combos.
     * Mocks the necessary methods to return the expected combos data.
     */
    it("should fetch saved breeding combos successfully", async () => {
      // Mock responses for each Supabase query
      supabase.from.mockImplementation((table) => {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockImplementation((key, value) => {
            if (table === "saved_breeding_combinations" && key === "user_id") {
              return { data: [{ breeding_combo_id: "combo1" }], error: null };
            }
            if (table === "breedingCombos" && key === "id") {
              return {
                single: jest
                  .fn()
                  .mockResolvedValue({
                    data: {
                      parent1: "parent1",
                      parent2: "parent2",
                      child: "child",
                    },
                    error: null,
                  }),
              };
            }
            if (table === "palInfo") {
              if (key === "name" && value === "parent1") {
                return {
                  single: jest
                    .fn()
                    .mockResolvedValue({
                      data: { name: "parent1", id: "p1" },
                      error: null,
                    }),
                };
              }
              if (key === "name" && value === "parent2") {
                return {
                  single: jest
                    .fn()
                    .mockResolvedValue({
                      data: { name: "parent2", id: "p2" },
                      error: null,
                    }),
                };
              }
              if (key === "name" && value === "child") {
                return {
                  single: jest
                    .fn()
                    .mockResolvedValue({
                      data: { name: "child", id: "c1" },
                      error: null,
                    }),
                };
              }
            }
            return { data: null, error: new Error("Unknown error") };
          }),
        };
      });

      const combos = await fetchSavedBreedingCombos("user1");
      expect(combos).toEqual([
        {
          breeding_combo_id: "combo1",
          parent1: { name: "parent1", image: "/images/pals/p1.png" },
          parent2: { name: "parent2", image: "/images/pals/p2.png" },
          child: { name: "child", image: "/images/pals/c1.png" },
        },
      ]);
    });

    /**
     * Test case for handling the scenario where no saved combos are found.
     * Mocks the necessary methods to return an empty array.
     */
    it("should return an empty array if no saved combos are found", async () => {
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const combos = await fetchSavedBreedingCombos("user1");
      expect(combos).toEqual([]);
    });

    /**
     * Test case for handling errors when fetching saved breeding combos.
     * Mocks the necessary methods to simulate an error and return an empty array.
     */
    it("should handle errors and return an empty array", async () => {
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest
          .fn()
          .mockResolvedValue({ data: null, error: new Error("Fetch error") }),
      });

      const combos = await fetchSavedBreedingCombos("user1");
      expect(combos).toEqual([]);
    });
  });

  /**
   * Test suite for the addSavedBreedingCombo function.
   */
  describe("addSavedBreedingCombo", () => {
    /**
     * Test case for successfully adding a saved breeding combo.
     * Mocks the necessary methods to return the expected combo data.
     */
    it("should add a saved breeding combo successfully", async () => {
      supabase.insert.mockReturnValueOnce({
        data: [{ user_id: "user1", breeding_combo_id: "combo1" }],
        error: null,
      });

      const result = await addSavedBreedingCombo("user1", "combo1");
      expect(result).toEqual([
        { user_id: "user1", breeding_combo_id: "combo1" },
      ]);
      expect(revalidatePath).toHaveBeenCalledWith("/saved-combinations");
    });

    /**
     * Test case for handling errors when adding a saved breeding combo.
     * Mocks the necessary methods to simulate an error.
     */
    it("should handle errors when adding a saved breeding combo", async () => {
      supabase.insert.mockReturnValueOnce({
        data: null,
        error: new Error("Insert error"),
      });

      await expect(addSavedBreedingCombo("user1", "combo1")).rejects.toThrow(
        "Insert error"
      );
    });
  });

  /**
   * Test suite for the removeSavedBreedingCombo function.
   */
  describe("removeSavedBreedingCombo", () => {
    /**
     * Test case for successfully removing a saved breeding combo.
     * Mocks the necessary methods to return the expected combo data.
     */
    it("should remove a saved breeding combo successfully", async () => {
      supabase.from.mockImplementation((table) => {
        return {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockImplementation((key, value) => {
            if (table === "saved_breeding_combinations" && key === "user_id") {
              return {
                eq: jest.fn().mockImplementation((key2, value2) => {
                  if (key2 === "breeding_combo_id") {
                    return {
                      data: [{ user_id: "user1", breeding_combo_id: "combo1" }],
                      error: null,
                    };
                  }
                  return { data: null, error: new Error("Unknown error") };
                }),
              };
            }
            return { data: null, error: new Error("Unknown error") };
          }),
        };
      });

      const result = await removeSavedBreedingCombo("user1", "combo1");
      expect(result).toEqual([
        { user_id: "user1", breeding_combo_id: "combo1" },
      ]);
      expect(revalidatePath).toHaveBeenCalledWith("/saved-combinations");
    });

    /**
     * Test case for handling errors when removing a saved breeding combo.
     * Mocks the necessary methods to simulate an error.
     */
    it("should handle errors when removing a saved breeding combo", async () => {
      supabase.from.mockImplementation((table) => {
        return {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockImplementation((key, value) => {
            if (table === "saved_breeding_combinations" && key === "user_id") {
              return {
                eq: jest.fn().mockImplementation((key2, value2) => {
                  if (key2 === "breeding_combo_id") {
                    return { data: null, error: new Error("Delete error") };
                  }
                  return { data: null, error: new Error("Unknown error") };
                }),
              };
            }
            return { data: null, error: new Error("Unknown error") };
          }),
        };
      });

      await expect(removeSavedBreedingCombo("user1", "combo1")).rejects.toThrow(
        "Delete error"
      );
    });
  });
});