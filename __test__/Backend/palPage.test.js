import {
  addFavoritePal,
  removeFavoritePal,
  getUserFavorites,
  fetchSavedBreedingCombos,
  addSavedBreedingCombo,
  removeSavedBreedingCombo,
  getPalDetailsAndFavorites,
} from "../../(pals)/pal/[palName]/actions";
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
      rpc: jest.fn().mockReturnThis(),
    };

    // Set the mock implementation to return the mocked Supabase client
    createClient.mockReturnValue(supabase);
  });

  /**
   * Test suite for the addFavoritePal function.
   */
  describe("addFavoritePal", () => {
    /**
     * Test case for successfully adding a favourite pal.
     */
    it("should add a favourite pal successfully", async () => {
      supabase.insert.mockReturnValueOnce({
        data: [{ user_id: "user1", pal_id: "pal1" }],
        error: null,
      });

      const result = await addFavoritePal("user1", "pal1");
      expect(result).toEqual([{ user_id: "user1", pal_id: "pal1" }]);
      expect(revalidatePath).toHaveBeenCalledWith("/favourite-pals");
    });

    /**
     * Test case for handling errors when adding a favourite pal.
     */
    it("should handle errors when adding a favourite pal", async () => {
      supabase.insert.mockReturnValueOnce({
        data: null,
        error: new Error("Insert error"),
      });

      await expect(addFavoritePal("user1", "pal1")).rejects.toThrow(
        "Insert error"
      );
    });
  });

  /**
   * Test suite for the removeFavoritePal function.
   */
  describe("removeFavoritePal", () => {
    /**
     * Test case for successfully removing a favourite pal.
     */
    it("should remove a favourite pal successfully", async () => {
      supabase.from.mockImplementation((table) => {
        if (table === "favourites") {
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((key, value) => {
              if (key === "user_id") {
                return {
                  eq: jest.fn().mockImplementation((key2, value2) => {
                    if (key2 === "pal_id") {
                      return {
                        data: [{ user_id: "user1", pal_id: "pal1" }],
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
        }
        return { data: null, error: new Error("Unknown error") };
      });

      const result = await removeFavoritePal("user1", "pal1");
      expect(result).toEqual([{ user_id: "user1", pal_id: "pal1" }]);
      expect(revalidatePath).toHaveBeenCalledWith("/favourite-pals");
    });

    /**
     * Test case for handling errors when removing a favourite pal.
     */
    it("should handle errors when removing a favourite pal", async () => {
      supabase.from.mockImplementation((table) => {
        if (table === "favourites") {
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((key, value) => {
              if (key === "user_id") {
                return {
                  eq: jest.fn().mockImplementation((key2, value2) => {
                    if (key2 === "pal_id") {
                      return { data: null, error: new Error("Delete error") };
                    }
                    return { data: null, error: new Error("Unknown error") };
                  }),
                };
              }
              return { data: null, error: new Error("Unknown error") };
            }),
          };
        }
        return { data: null, error: new Error("Unknown error") };
      });

      await expect(removeFavoritePal("user1", "pal1")).rejects.toThrow(
        "Delete error"
      );
    });
  });

  /**
   * Test suite for the getUserFavorites function.
   */
  describe("getUserFavorites", () => {
    /**
     * Test case for successfully fetching user favourites.
     */
    it("should fetch user favourites successfully", async () => {
      supabase.select.mockReturnValueOnce({
        eq: jest
          .fn()
          .mockReturnValueOnce({
            data: [{ pal_id: "pal1" }, { pal_id: "pal2" }],
            error: null,
          }),
      });

      const result = await getUserFavorites("user1");
      expect(result).toEqual(["pal1", "pal2"]);
    });

    /**
     * Test case for handling errors and returning an empty array.
     */
    it("should handle errors and return an empty array", async () => {
      supabase.select.mockReturnValueOnce({
        eq: jest
          .fn()
          .mockReturnValueOnce({ data: null, error: new Error("Fetch error") }),
      });

      const result = await getUserFavorites("user1");
      expect(result).toEqual([]);
    });
  });

  /**
   * Test suite for the fetchSavedBreedingCombos function.
   */
  describe("fetchSavedBreedingCombos", () => {
    /**
     * Test case for successfully fetching saved breeding combos.
     */
    it("should fetch saved breeding combos successfully", async () => {
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
                    data: { parent1: "parent1", parent2: "parent2" },
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
        },
      ]);
    });

    /**
     * Test case for handling the scenario where no saved combos are found.
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
     * Test case for handling errors and returning an empty array.
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

  /**
   * Test suite for the getPalDetailsAndFavorites function.
   */
  describe("getPalDetailsAndFavorites", () => {
    /**
     * Test case for successfully fetching pal details and favourites.
     */
    it("should fetch pal details and favourites successfully", async () => {
      supabase.rpc.mockReturnValueOnce({
        data: [{ name: "pal1", is_favorite: true }],
        error: null,
      });

      const result = await getPalDetailsAndFavorites("user1", "pal1");
      expect(result).toEqual({ name: "pal1", is_favorite: true });
    });

    /**
     * Test case for handling errors and returning null.
     */
    it("should handle errors and return null", async () => {
      supabase.rpc.mockReturnValueOnce({
        data: null,
        error: new Error("RPC error"),
      });

      const result = await getPalDetailsAndFavorites("user1", "pal1");
      expect(result).toBeNull();
    });
  });
});