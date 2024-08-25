import { NextResponse } from "next/server";
import {
  getFavouritePals,
  addFavouritePal,
  removeFavouritePal,
} from "@/app/services/userService";

/**
 * @typedef {Object} Skill
 * @property {string} skill_name - The name of the skill
 * @property {number} work_order - The order of the skill in the work list
 * @property {number} skill_level - The level of the skill
 * @property {string} skill_icon_url - The URL of the skill's icon
 */

/**
 * @typedef {Object} FavouritePal
 * @property {string} id - The unique identifier of the pal
 * @property {string} name - The name of the pal
 * @property {string} type1 - The primary type of the pal
 * @property {string|null} type2 - The secondary type of the pal, if any
 * @property {string} description - A description of the pal
 * @property {string} image_url - The URL of the pal's image
 * @property {string} type1_icon_url - The URL of the icon for the pal's primary type
 * @property {string|null} type2_icon_url - The URL of the icon for the pal's secondary type, if any
 * @property {Skill[]} skills - An array of skills the pal possesses
 */

/**
 * Handles GET requests to retrieve a user's favourite pals
 * @async
 * @function
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response containing the user's favourite pals or an error message
 */
export async function GET(request) {
  // Extract the user ID from the request headers
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const favourites = await getFavouritePals(userId);
    return NextResponse.json(favourites);
  } catch (error) {
    console.error("Error in GET /api/favourites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handles POST requests to add a pal to a user's favourites
 * @async
 * @function
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response indicating success or failure of the operation
 */
export async function POST(request) {
  const { palId } = await request.json();

  // Extract the user ID from the request headers
  const userId = request.headers.get("x-user-id");

  if (!userId || !palId) {
    return NextResponse.json(
      { error: "User ID and Pal ID are required" },
      { status: 400 }
    );
  }

  try {
    await addFavouritePal(userId, palId);
    return NextResponse.json({ message: "Favourite added successfully" });
  } catch (error) {
    console.error("Error in POST /api/favourites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to remove a pal from a user's favourites
 * @async
 * @function
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The response indicating success or failure of the operation
 */
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const palId = searchParams.get("palId");

  // Extract the user ID from the request headers
  const userId = request.headers.get("x-user-id");

  if (!userId || !palId) {
    return NextResponse.json(
      { error: "User ID and Pal ID are required" },
      { status: 400 }
    );
  }

  try {
    await removeFavouritePal(userId, palId);
    return NextResponse.json({ message: "Favourite removed successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/favourites:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
