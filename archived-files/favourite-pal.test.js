import { getFavouritePals } from "@/app/(pals)/favourite-pals/actions";
import { createClient } from "@/app/utils/supabase/server";

// Mock the Supabase client creation function
jest.mock("@/app/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

/**
 * Test suite for getFavouritePals function.
 */
describe("getFavouritePals", () => {
  let supabase;

  beforeEach(() => {
    // Clear all previous mock data before each test
    jest.clearAllMocks();

    // Mock the Supabase client methods
    supabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    };

    // Set the mock implementation to return the mocked Supabase client
    createClient.mockReturnValue(supabase);
  });

  /**
   * Test case for successfully fetching favourite pals.
   * Mocks the necessary methods to return the expected favourite pals data.
   */
  it("should fetch favourite pals successfully", async () => {
    supabase.from.mockImplementation((table) => {
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockImplementation((key, value) => {
          if (table === "favourites" && key === "user_id") {
            return {
              data: [{ pal_id: "pal1" }, { pal_id: "pal2" }],
              error: null,
            };
          }
          return { data: null, error: new Error("Unknown error") };
        }),
        in: jest.fn().mockImplementation((key, values) => {
          if (
            table === "palInfo" &&
            key === "id" &&
            values.includes("pal1") &&
            values.includes("pal2")
          ) {
            return {
              data: [
                {
                  id: "pal1",
                  name: "Pal One",
                  type1: "Fire",
                  type2: "Water",
                  kindling: 10,
                  watering: 8,
                  planting: 7,
                  generating_electricity: 6,
                  handiwork: 5,
                  gathering: 4,
                  lumbering: 3,
                  mining: 2,
                  medicine_production: 1,
                  cooling: 9,
                  transporting: 11,
                  farming: 12,
                },
                {
                  id: "pal2",
                  name: "Pal Two",
                  type1: "Grass",
                  type2: "Electric",
                  kindling: 10,
                  watering: 8,
                  planting: 7,
                  generating_electricity: 6,
                  handiwork: 5,
                  gathering: 4,
                  lumbering: 3,
                  mining: 2,
                  medicine_production: 1,
                  cooling: 9,
                  transporting: 11,
                  farming: 12,
                },
              ],
              error: null,
            };
          }
          return { data: null, error: new Error("Unknown error") };
        }),
      };
    });

    const pals = await getFavouritePals("user1");
    expect(pals).toEqual([
      {
        id: "pal1",
        name: "Pal One",
        type1: "Fire",
        type2: "Water",
        kindling: 10,
        watering: 8,
        planting: 7,
        generating_electricity: 6,
        handiwork: 5,
        gathering: 4,
        lumbering: 3,
        mining: 2,
        medicine_production: 1,
        cooling: 9,
        transporting: 11,
        farming: 12,
      },
      {
        id: "pal2",
        name: "Pal Two",
        type1: "Grass",
        type2: "Electric",
        kindling: 10,
        watering: 8,
        planting: 7,
        generating_electricity: 6,
        handiwork: 5,
        gathering: 4,
        lumbering: 3,
        mining: 2,
        medicine_production: 1,
        cooling: 9,
        transporting: 11,
        farming: 12,
      },
    ]);
  });

  /**
   * Test case for handling the scenario where no favourite pals are found.
   * Mocks the necessary methods to return an empty array.
   */
  it("should return an empty array if no favourite pals are found", async () => {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    const pals = await getFavouritePals("user1");
    expect(pals).toEqual([]);
  });

  /**
   * Test case for handling errors when fetching favourite pals.
   * Mocks the necessary methods to simulate an error and return an empty array.
   */
  it("should handle errors and return an empty array", async () => {
    supabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest
        .fn()
        .mockResolvedValue({ data: null, error: new Error("Fetch error") }),
    });

    const pals = await getFavouritePals("user1");
    expect(pals).toEqual([]);
  });

  /**
   * Test case for handling errors during pal info fetch.
   * Mocks the necessary methods to simulate an error when fetching pal details and return an empty array.
   */
  it("should handle errors during pal info fetch and return an empty array", async () => {
    supabase.from.mockImplementation((table) => {
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockImplementation((key, value) => {
          if (table === "favourites" && key === "user_id") {
            return {
              data: [{ pal_id: "pal1" }, { pal_id: "pal2" }],
              error: null,
            };
          }
          return { data: null, error: new Error("Unknown error") };
        }),
        in: jest.fn().mockImplementation((key, values) => {
          if (table === "palInfo" && key === "id") {
            return { data: null, error: new Error("Fetch error") };
          }
          return { data: null, error: new Error("Unknown error") };
        }),
      };
    });

    const pals = await getFavouritePals("user1");
    expect(pals).toEqual([]);
  });
});